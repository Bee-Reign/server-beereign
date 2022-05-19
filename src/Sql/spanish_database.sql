--
-- Structure of the `types_of_employee` table
CREATE TABLE IF NOT EXISTS types_of_employee
(
    id          smallserial        NOT NULL,
    name        varchar(50)        NOT NULL,
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
-- Structure of the `employees` table
CREATE TABLE IF NOT EXISTS employees
(
    id                    bigserial          NOT NULL,
    name                  varchar(30)        NOT NULL,
    last_name             varchar(30)        NOT NULL,
    cell_phone            varchar(20),
    email                 varchar(256)       NOT NULL,
    password              varchar(255)       NOT NULL,
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
INSERT INTO countries (name)
VALUES ('colombia'),
('costa rica'),
('panamá');

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
INSERT INTO provinces (name, country_id)
VALUES ('bocas del toro', 3),
('coclé', 3),
('colón', 3),
('chiriquí', 3),
('darién', 3),
('herrera', 3),
('los santos', 3),
('panamá', 3),
('veraguas', 3),
('panamá oeste', 3);

--
-- Structure of the `apiaries` table
CREATE TABLE IF NOT EXISTS apiaries
(
    id              bigserial          NOT NULL,
    name            varchar(50)        NOT NULL,
    country_id      smallint           NOT NULL,
    province_id     bigint             NOT NULL,
    city            varchar(50)        NOT NULL,
    location        point,
    deleted         bool default false NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT apiaries_name_key UNIQUE(name),
    CONSTRAINT apiaries_countries_fkey FOREIGN KEY(country_id)
    REFERENCES countries(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT,
    CONSTRAINT apiaries_provinces_fkey FOREIGN KEY(province_id)
    REFERENCES provinces(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT
);

--
-- Structure of the `queen_bees` table
CREATE TABLE IF NOT EXISTS queen_bees
(
    id              bigserial           NOT NULL,
    race            varchar(50)         NOT NULL,
    it_bought       bool                NOT NULL,
    cost            decimal(7,2),
    date_purchased  date,
    is_death        bool default false  NOT NULL,
    reason_of_death varchar(50),
    created_at      timestamp           NOT NULL,
    deleted         bool default false  NOT NULL,
    PRIMARY KEY(id)
);

--
-- Structure of the `types_of_beehives` table
CREATE TABLE IF NOT EXISTS types_of_beehives
(
    id          smallserial         NOT NULL,
    type        varchar(50)         NOT NULL,
    deleted     bool default false  NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT types_of_beehives_type_key UNIQUE(type)
);

--
-- Structure of the `beehives` table
CREATE TABLE IF NOT EXISTS beehives
(
    id                      bigserial           NOT NULL,
    type_of_beehive_id      smallint            NOT NULL,
    it_bought               bool                NOT NULL,
    cost                    decimal(10,2),
    date_purchased          date,
    queen_bee_id            bigint,
    PRIMARY KEY(id),
    CONSTRAINT beehives_types_of_beehives_fkey FOREIGN KEY(type_of_beehive_id)
    REFERENCES types_of_beehives(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT,
    CONSTRAINT beehives_queen_bees_fkey FOREIGN KEY(queen_bee_id)
    REFERENCES queen_bees(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT
);

--
-- Structure of the `harvests` table
CREATE TABLE IF NOT EXISTS harvests
(
    id                  bigserial           NOT NULL,
    date                date                NOT NULL,
    quantity_of_panels  integer,
    description         varchar(255),
    it_done             bool default false  NOT NULL,
    apiary_id           bigint              NOT NULL,
    employee_id         bigint              NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT harvests_apiaries_fkey FOREIGN KEY(apiary_id)
    REFERENCES apiaries(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT,
    CONSTRAINT harvests_employees_fkey FOREIGN KEY(employee_id)
    REFERENCES employees(id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT
);

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
-- Structure of the `measurements` ENUM
CREATE TYPE measurement AS ENUM ('GALONES', 'GRAMOS', 'KILOGRAMOS', 'LIBRAS', 'LITROS', 'ONZAS', 'UNIDADES');

--
-- Structure of the `raw_material_batches` table
CREATE TABLE IF NOT EXISTS raw_material_batches
(
    id                  bigserial       NOT NULL,
    raw_material_id     integer         NOT NULL,
    warehouse_id        integer         NOT NULL,
    entry_date          date            NOT NULL,
    expiration_date     date,
    measurement         measurement     NOT NULL,
    quantity            decimal(12,4)   NOT NULL,
    unit_cost           decimal(12,2)   NOT NULL,
    total_cost          decimal(15,2)   NOT NULL,
    stock               decimal(12,4)   NOT NULL,
    employee_id         bigint          NOT NULL,
    created_at          timestamp       NOT NULL,
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
    name            varchar(100)            NOT NULL,
    description     varchar(255),
    created_at      timestamp               NOT NULL,
    deleted         bool default false      NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT products_barcode_key UNIQUE(barcode)
);
