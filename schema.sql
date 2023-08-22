DROP TABLE IF EXISTS labor;
CREATE TABLE hr_labor (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  id_card_number VARCHAR(16) NOT NULL UNIQUE,
  firstname VARCHAR(128) NOT NULL,
  middlename VARCHAR(128),
  lastname VARCHAR(128),
  birthdate DATE NOT NULL,
  gender VARCHAR(1) NOT NULL, -- M / F
  nationality VARCHAR(64) NOT NULL,
  marital_status BOOLEAN NOT NULL DEFAULT FALSE,
  profile_picture VARCHAR(64),
  contact_address VARCHAR(128),
  contact_phone VARCHAR(16),
  contact_email VARCHAR(128),
  emergency_contact_name VARCHAR(128),
  emergency_contact_phone VARCHAR(16),
  tax_id VARCHAR(32),
  status VARCHAR(16) NOT NULL, -- PRE-EMPLOYEE, ACTIVE, INACTIVE
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS company_category;
CREATE TABLE public.company_category
(
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  system_id VARCHAR(32) UNIQUE,
  category_name VARCHAR(128) NOT NULL UNIQUE,
  created_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT false
);

DROP TABLE IF EXISTS company;
CREATE TABLE public.company
(
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  system_id VARCHAR(32) UNIQUE,
  company_name VARCHAR(128) NOT NULL UNIQUE,
  category_id VARCHAR(36) NOT NULL,
  parent_company_id VARCHAR(36),
  created_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT fk_category_id
    FOREIGN KEY(category_id)
  REFERENCES company_category(id),
  CONSTRAINT fk_parent_company_id
    FOREIGN KEY(parent_company_id)
  REFERENCES company(id)
);

DROP VIEW IF EXISTS v_company;
CREATE VIEW v_company AS SELECT c1.*, c2.company_name AS parent_company, cc.category_name FROM company c1 LEFT JOIN company c2 ON c1.parent_company_id = c2.id JOIN company_category cc ON c1.category_id = cc.id;

DROP TABLE IF EXISTS department;
CREATE TABLE public.department
(
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  system_id VARCHAR(32) UNIQUE,
  department_name VARCHAR(128) NOT NULL,
  parent_department_id VARCHAR(36),
  company_id VARCHAR(36) NOT NULL,
  created_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT fk_company_id
    FOREIGN KEY(company_id)
  REFERENCES company(id),
  UNIQUE (department_name, company_id)
);

DROP VIEW IF EXISTS v_department;
CREATE VIEW v_department AS SELECT d1.*, d2.department_name AS parent_department, c.company_name FROM department d1 LEFT JOIN department d2 ON d1.parent_department_id = d2.id JOIN company c ON d1.company_id = c.id;

DROP TABLE IF EXISTS position;
CREATE TABLE public.position
(
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  system_id VARCHAR(32) UNIQUE,
  position_name VARCHAR(128) NOT NULL,
  is_head BOOLEAN NOT NULL DEFAULT false,
  department_id VARCHAR(36) NOT NULL,
  company_id VARCHAR(36) NOT NULL,
  created_at timestamp without time zone NOT NULL,
  updated_at timestamp without time zone NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT fk_department_id
    FOREIGN KEY(department_id)
  REFERENCES department(id),
  CONSTRAINT fk_company_id
    FOREIGN KEY(company_id)
  REFERENCES company(id),
  UNIQUE (position_name, department_id, company_id)
);

DROP VIEW IF EXISTS v_position;
CREATE VIEW v_position AS SELECT p.*, d.department_name, c.company_name FROM position p JOIN department d ON p.department_id = d.id JOIN company c ON p.company_id = c.id;