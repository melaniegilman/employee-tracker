INSERT INTO department (department_name)
VALUES
  ('Human Resources'),
  ('Sales'),
  ('Engineering'),
  ('Research and Development'),
  ('Finance'),
  ('Operations');
  

INSERT INTO employee_role (title, salary, department_id)
VALUES
 ('Data Analyst', 80000, 4),
 ('FrontEnd Developer', 50000, 3),
 ('Manager', 90000, 4),
 ('Sales Representative', 65000, 2),
 ('Software Engineer', 70000, 3),
 ('HR Manager', 70000, 1),
 ('Operations Manager', 80000, 6),
 ('Accountant', 85000, 5);



INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Wibur', 'Basset', 3, null),
  ('Melanie', 'Gilman', 2, 1),
  ('Mohican', 'Beagle', 5, 1),
  ('Grant', 'Emerson', 6, 3),
  ('Mallory', 'Korpics', 7, 3),
  ('Janelle', 'Riaubia', 8, 6),
  ('John', 'Cox', 1, 6),
  ('Ellen', 'Robeson', 4, 2),
  ('Misha', 'Kutcher', 6, 1); 