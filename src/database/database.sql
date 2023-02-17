--
-- Structure of the `beereign_app_config` table
CREATE TABLE IF NOT EXISTS beereign_app_config
(
    key             varchar(30)        NOT NULL,
    value           varchar(300)       NOT NULL,
    PRIMARY KEY(key)
);

--
-- Data for the table `beereign_app_config`
INSERT INTO beereign_app_config (key, value) VALUES
('address', '0000 Random Park, Panamá'),
('company', 'Your Company Name'),
('email', 'contact@yourdomain.com'),
('phone', '+0 000-0000'),
('website', 'your-company.com'),
('company_logo_url', '');

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

--
-- Data for the table `modules`

INSERT INTO modules (name, path) VALUES
('bodegas', 'warehouse'),
('clientes', 'customer'),
('configuración', 'config'),
('empleados', 'employee'),
('envasado', 'packing'),
('facturación', 'billing'),
('inventario de materia prima', 'raw-material'),
('inventario de productos', 'product'),
('tipos de empleado', 'type-of-employee');

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
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

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
(1, 9);

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
-- Structure of the `measurements` ENUM
CREATE TYPE measurement AS ENUM ('GALONES', 'GRAMOS', 'KILOGRAMOS', 'LIBRAS', 'LITROS', 'ONZAS', 'UNIDADES');

--
-- Structure of the `raw_materials` table
CREATE TABLE IF NOT EXISTS raw_materials
(
    id              serial              NOT NULL,
    code            varchar(12),
    name            varchar(50)         NOT NULL,
    measurement     measurement         NOT NULL,
    created_at      timestamp           NOT NULL,
    deleted         bool default false  NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT raw_materials_code_key UNIQUE(code)
);

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

--
-- Structure of the `raw_material_batches` table
CREATE TABLE IF NOT EXISTS raw_material_batches
(
    id                  bigserial            NOT NULL,
    raw_material_id     integer              NOT NULL,
    warehouse_id        integer              NOT NULL,
    entry_date          date                 NOT NULL,
    expiration_date     date,
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

--
-- Structure of the `products` table
CREATE TABLE IF NOT EXISTS products
(
    id              serial                  NOT NULL,
    barcode         varchar(128),
    name            varchar(50)             NOT NULL,
    description     varchar(255),
    created_at      timestamp               NOT NULL,
    deleted         bool default false      NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT products_barcode_key UNIQUE(barcode)
);

--
-- Structure of the `packings` table
CREATE TABLE IF NOT EXISTS packings
(
    id                  bigserial             NOT NULL,
    product_id          integer               NOT NULL,
    warehouse_id        integer               NOT NULL,
    entry_date          date                  NOT NULL,
    expiration_date     date,
    quantity            integer               NOT NULL,
    employee_id         integer               NOT NULL,
    is_done             bool                  NOT NULL,
    created_at          timestamp             NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT packings_product_fkey FOREIGN KEY(product_id)
    REFERENCES products(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT,
    CONSTRAINT packings_warehouses_fkey FOREIGN KEY(warehouse_id)
    REFERENCES warehouses(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT,
    CONSTRAINT packings_employees_fkey FOREIGN KEY(employee_id)
    REFERENCES employees(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT
);

--
-- Structure of the `packings_packing_details` table
CREATE TABLE IF NOT EXISTS packing_details
(
    packing_id                  bigserial             NOT NULL,
    raw_material_batch_id       bigint                NOT NULL,
    quantity_used               decimal(12,2)         NOT NULL,
    PRIMARY KEY(packing_id, raw_material_batch_id),
    CONSTRAINT packings_details_packings FOREIGN KEY(packing_id)
    REFERENCES packings(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT,
    CONSTRAINT packings_details_raw_material_batch FOREIGN KEY(raw_material_batch_id)
    REFERENCES raw_material_batches(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT
);

--
-- Structure of the `product_batches` table
CREATE TABLE IF NOT EXISTS product_batches
(
    id                  bigserial             NOT NULL,
    unit_cost           decimal(12,2)         NOT NULL,
    cost_value          decimal(15, 2)        GENERATED ALWAYS AS (unit_cost * stock) STORED,
    stock               integer               NOT NULL,
    deleted             bool default false    NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT product_batches_packings_fkey FOREIGN KEY(id)
    REFERENCES packings(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT
);
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
