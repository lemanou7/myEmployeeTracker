USE employeedb;

INSERT INTO department (name)
VALUES ("Human resources");
INSERT INTO department (name)
VALUES ("Marketing");
INSERT INTO department (name)
VALUES ("Engineering");
INSERT INTO department (name)
VALUES ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("HR Lead", 120000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Marketing Manager", 170000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 111000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Legal Team Lead", 250000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Therese", "Oloko", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mike", "Alabi", 3, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Diabate", "Ismael", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Keita", "Issa", 5, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sarah", "Lourd", 2, 8);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kelly", "Sylla", 4, 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Christopher", "Tyson", 1, 2);

