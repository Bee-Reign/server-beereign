--
-- System role creation
DO
$do$
BEGIN
   IF EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'beereign') THEN

      RAISE NOTICE 'The role with the name {beereign} already exists';
   ELSE
--                                      ************     ↓↓↓↓↓-> replace for security ↓↓↓     *************
      CREATE ROLE beereign WITH LOGIN ENCRYPTED PASSWORD 'generate-and-replace-password';
   END IF;
END
$do$;

--
-- Structure of the `types_of_employee` table
CREATE TABLE IF NOT EXISTS types_of_employee
(
    id          smallserial        NOT NULL,
    name        varchar(30)        NOT NULL,
    description varchar(255)       NOT NULL,
    deleted     bool default false NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT types_of_employee_name_key UNIQUE(name)
);
GRANT INSERT, SELECT, UPDATE ON TABLE types_of_employee TO beereign;

--
-- Data for the table `types_of_employee`
INSERT INTO types_of_employee (name, description, deleted) VALUES
('administrador', 'tiene acceso global al sistema', false);

--
-- Structure of the `modules` table
CREATE TABLE IF NOT EXISTS modules
(
    id          smallserial        NOT NULL,
    name        varchar(50)        NOT NULL,
    path        varchar(50)        NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT modules_name_key UNIQUE(name),
    CONSTRAINT modules_path_key UNIQUE(path)
);
GRANT SELECT ON TABLE modules TO beereign;

--
-- Data for the table `modules`

INSERT INTO modules (name, path) VALUES
('Bodegas', '/warehouse'),
('Envasado', '/packing'),
('Empleados', '/employee'),
('Entrada de Materia Prima', '/raw-material-input'),
('Inventario de Materia Prima', '/raw-material'),
('Inventario de Productos', '/product'),
('Lotes de Materia Prima', '/raw-material-batch'),
('Lotes de Productos', '/product-batch'),
('Salida de Productos', '/product-output'),
('Tipos de Empleado', '/type-of-employee');

--
-- Structure of the `type_of_employee_modules` table
CREATE TABLE IF NOT EXISTS type_of_employee_modules
(
    type_of_employee_id   smallint           NOT NULL,
    module_id             smallint           NOT NULL,
    CONSTRAINT employee_type_fkey FOREIGN KEY(type_of_employee_id)
    REFERENCES types_of_employee(id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    CONSTRAINT module_fkey FOREIGN KEY(module_id)
    REFERENCES modules(id) MATCH SIMPLE
);
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE type_of_employee_modules TO beereign;

--
-- Data for the table `type_of_employee_modules`
INSERT INTO type_of_employee_modules(type_of_employee_id, module_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11);

--
-- Structure of the `employees` table
CREATE TABLE IF NOT EXISTS employees
(
    id                    serial             NOT NULL,
    name                  varchar(30)        NOT NULL,
    last_name             varchar(30)        NOT NULL,
    cell_phone            varchar(20),
    email                 varchar(256)       NOT NULL,
    password              varchar(255)       NOT NULL,
    recovery_token        varchar(255),
    type_of_employee_id   smallint           NOT NULL,
    created_at            timestamp          NOT NULL,
    deleted               bool default false NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT employees_email_key UNIQUE(email),
    CONSTRAINT employee_type_fkey FOREIGN KEY(type_of_employee_id)
    REFERENCES types_of_employee(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT
);
GRANT INSERT, SELECT, UPDATE ON TABLE type_of_employee_modules TO beereign;

-- employee records
-- Default Email: admin@example.com
-- Default Password: BeeR3in&
INSERT INTO employees (name, last_name, cell_phone, email, password, type_of_employee_id, created_at, deleted)
VALUES ('admin', 'admin', '', 'admin@example.com', '$2b$10$uU7KGDkFfgF8JL.bWe.bvu5t8oQSRna56rivPcodb5Qgoys22ohmi', 1, now(), default);

--
-- Structure of the `countries` table
CREATE TABLE IF NOT EXISTS countries
(
    id      smallserial     NOT NULL,
    name    varchar(50)     NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT countries_name_key UNIQUE(name)
);
GRANT INSERT, SELECT, UPDATE ON TABLE countries TO beereign;

--
-- Data for the table `countries`
INSERT INTO countries (name)
VALUES ('panamá');

--
-- Structure of the `provinces` table
CREATE TABLE IF NOT EXISTS provinces
(
    id              bigserial       NOT NULL,
    name            varchar(50)     NOT NULL,
    country_id      smallint        NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT provinces_countries_fkey FOREIGN KEY(country_id)
    REFERENCES countries(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT
);
GRANT INSERT, SELECT, UPDATE ON TABLE provinces TO beereign;

--
-- Data for the table `provinces`
INSERT INTO provinces (name, country_id)
VALUES ('bocas del toro', 1),
('coclé', 1),
('colón', 1),
('chiriquí', 1),
('darién', 1),
('herrera', 1),
('los santos', 1),
('panamá', 1),
('veraguas', 1),
('panamá oeste', 1);

--
-- Structure of the `raw_materials` table
CREATE TABLE IF NOT EXISTS raw_materials
(
    id              serial              NOT NULL,
    code            varchar(12),
    name            varchar(100)        NOT NULL,
    created_at      timestamp           NOT NULL,
    deleted         bool default false  NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT raw_materials_code_key UNIQUE(code)
);
GRANT INSERT, SELECT, UPDATE ON TABLE raw_materials TO beereign;

--
-- Structure of the `warehouses` table
CREATE TABLE IF NOT EXISTS warehouses
(
    id              smallserial        NOT NULL,
    name            varchar(50)        NOT NULL,
    country_id      smallint           NOT NULL,
    province_id     bigint             NOT NULL,
    city            varchar(50)        NOT NULL,
    deleted         bool default false NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT warehouses_name_key UNIQUE(name),
    CONSTRAINT warehouses_countries_fkey FOREIGN KEY(country_id)
    REFERENCES countries(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT,
    CONSTRAINT warehouses_provinces_fkey FOREIGN KEY(province_id)
    REFERENCES provinces(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT
);
GRANT INSERT, SELECT, UPDATE ON TABLE warehouses TO beereign;

--
-- Structure of the `measurements` ENUM
CREATE TYPE measurement AS ENUM ('GALONES', 'GRAMOS', 'KILOGRAMOS', 'LIBRAS', 'LITROS', 'ONZAS', 'UNIDADES');

--
-- Structure of the `raw_material_batches` table
-- Functions
CREATE OR REPLACE FUNCTION rawMaterialStockById (id integer)
RETURNS decimal(12,2) AS $stock$
declare
	stock decimal(12,2);
BEGIN
   SELECT sum(rawMaterialBatch.stock) into stock FROM raw_material_batches rawMaterialBatch WHERE rawMaterialBatch.raw_material_id = $1 AND rawMaterialBatch.stock > 0;
   RETURN stock;
END;
$stock$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION rawMaterialAverageCost (id integer)
RETURNS decimal(12,2) AS $averageCost$
declare
	averageCost decimal(12,2);
BEGIN
   SELECT ROUND(AVG(rawMaterialBatch.unit_cost), 2) into averageCost FROM raw_material_batches rawMaterialBatch WHERE rawMaterialBatch.raw_material_id = $1 AND rawMaterialBatch.stock > 0;
   RETURN averageCost;
END;
$averageCost$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION rawMaterialCostValue (id integer)
RETURNS decimal(15,2) AS $costValue$
declare
	costValue decimal(12,2);
BEGIN
   SELECT ROUND(sum(rawMaterialBatch.cost_value), 2) into costValue FROM raw_material_batches rawMaterialBatch WHERE rawMaterialBatch.raw_material_id = $1 AND rawMaterialBatch.stock > 0;
   RETURN costValue;
END;
$costValue$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION rawMaterialMeasurement (id integer)
RETURNS measurement AS $measurement$
declare
	measurement measurement;
BEGIN
   SELECT rawMaterialBatch.measurement into measurement FROM raw_material_batches rawMaterialBatch WHERE rawMaterialBatch.raw_material_id = $1 AND rawMaterialBatch.stock > 0 ORDER BY rawMaterialBatch.id DESC LIMIT 1;
   RETURN measurement;
END;
$measurement$ LANGUAGE plpgsql;

-- Table
CREATE TABLE IF NOT EXISTS raw_material_batches
(
    id                  bigserial            NOT NULL,
    raw_material_id     integer              NOT NULL,
    warehouse_id        integer              NOT NULL,
    entry_date          date                 NOT NULL,
    expiration_date     date,
    measurement         measurement          NOT NULL,
    quantity            decimal(12,2)        NOT NULL,
    unit_cost           decimal(12,2)        NOT NULL,
    cost_value          decimal(15, 2)       GENERATED ALWAYS AS (unit_cost * stock) STORED,
    stock               decimal(12,2)        NOT NULL,
    employee_id         integer              NOT NULL,
    deleted             bool default false   NOT NULL,
    created_at          timestamp            NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT raw_material_batches_raw_material_fkey FOREIGN KEY(raw_material_id)
    REFERENCES raw_materials(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT,
    CONSTRAINT raw_material_batches_warehouses_fkey FOREIGN KEY(warehouse_id)
    REFERENCES warehouses(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT,
    CONSTRAINT raw_material_batches_employees_fkey FOREIGN KEY(employee_id)
    REFERENCES employees(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT
);
GRANT INSERT, SELECT, UPDATE ON TABLE raw_material_batches TO beereign;

--
-- Structure of the `products` table
CREATE TABLE IF NOT EXISTS products
(
    id              serial                  NOT NULL,
    barcode         varchar(128),
    name            varchar(100)            NOT NULL,
    description     varchar(255),
    created_at      timestamp               NOT NULL,
    deleted         bool default false      NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT products_barcode_key UNIQUE(barcode)
);
GRANT INSERT, SELECT, UPDATE ON TABLE products TO beereign;



--
-- Structure of the `product_batches` table
-- Functions
CREATE OR REPLACE FUNCTION productStockById (id integer)
RETURNS integer AS $stock$
declare
	stock integer;
BEGIN
   SELECT sum(productBatches.stock) into stock FROM product_batches productBatches WHERE productBatches.product_id = $1 AND productBatches.stock > 0;
   RETURN stock;
END;
$stock$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION productAverageCost (id integer)
RETURNS decimal(12,2) AS $averageCost$
declare
	averageCost decimal(12,2);
BEGIN
   SELECT ROUND(AVG(productBatches.unit_cost), 2) into averageCost FROM product_batches productBatches WHERE productBatches.product_id = $1 AND productBatches.stock > 0;
   RETURN averageCost;
END;
$averageCost$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION productCostValue (id integer)
RETURNS decimal(15,2) AS $costValue$
declare
	costValue decimal(12,2);
BEGIN
   SELECT ROUND(sum(productBatches.cost_value), 2) into costValue FROM product_batches productBatches WHERE productBatches.product_id = $1 AND productBatches.stock > 0;
   RETURN costValue;
END;
$costValue$ LANGUAGE plpgsql;
-- Table
CREATE TABLE IF NOT EXISTS product_batches
(
    id                  bigserial             NOT NULL,
    product_id          integer               NOT NULL,
    warehouse_id        integer               NOT NULL,
    entry_date          date                  NOT NULL,
    expiration_date     date,
    quantity            integer               NOT NULL,
    unit_cost           decimal(12,2)         NOT NULL,
    cost_value          decimal(15, 2)        GENERATED ALWAYS AS (unit_cost * stock) STORED,
    stock               integer               NOT NULL,
    employee_id         integer               NOT NULL,
    deleted             bool default false    NOT NULL,
    created_at          timestamp             NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT product_batches_product_fkey FOREIGN KEY(product_id)
    REFERENCES products(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT,
    CONSTRAINT product_batches_warehouses_fkey FOREIGN KEY(warehouse_id)
    REFERENCES warehouses(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT,
    CONSTRAINT product_batches_employees_fkey FOREIGN KEY(employee_id)
    REFERENCES employees(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT
);
GRANT INSERT, SELECT, UPDATE ON TABLE product_batches TO beereign;

--
-- Structure of the `typeofsale` ENUM
CREATE TYPE typeofsale AS ENUM ('CONTADO', 'CRÉDITO');


--
-- Structure of the `product_outputs` table
CREATE TABLE IF NOT EXISTS product_outputs
(
    id                  bigserial             NOT NULL,
    amount              decimal(15, 2)        NOT NULL,
    type_of_sale        typeofsale            NOT NULL,
    is_paid             bool                  NOT NULL,
    cancelled           bool default false    NOT NULL,
    employee_id         integer               NOT NULL,
    created_at          timestamp             NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT product_outputs_employees_fkey FOREIGN KEY(employee_id)
    REFERENCES employees(id)
    ON UPDATE NO ACTION
    ON DELETE RESTRICT
);
GRANT INSERT, SELECT, UPDATE ON TABLE product_outputs TO beereign;

--
-- Structure of the `product_output_details` table
CREATE TABLE IF NOT EXISTS product_output_details
(
    product_output_id   bigserial             NOT NULL,
    product_batch_id    bigint                NOT NULL,
    quantity            integer               NOT NULL,
    price               decimal(12, 2)        NOT NULL,
    PRIMARY KEY(product_output_id, product_batch_id),
    CONSTRAINT product_output_details_product_output_fkey FOREIGN KEY(product_output_id)
    REFERENCES product_outputs(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT,
    CONSTRAINT product_output_details_product_batch_fkey FOREIGN KEY(product_batch_id)
    REFERENCES product_batches(id)
    ON UPDATE NO ACTION
    ON DELETE RESTRICT
);
GRANT INSERT, SELECT, UPDATE ON TABLE product_output_details TO beereign;
