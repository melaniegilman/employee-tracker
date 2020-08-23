const fs = require("fs")
const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');
const query = require('express');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  // Your MySQL username
  user: 'root',
  // Your MySQL password
  password: 'Mohican55!',
  database: 'employeeDb'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connection is successful');
    start();
  });

//function to prompt user
function start() {
    inquirer.prompt([
    {
        type: 'list',
        name: 'options',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'View All Departments', 'View All Roles', 'Add Employee', 'Add Department', 'Add Role',  'Update Employee Role', 'Remove Employee', 'Remove Department', 'Remove Role', 'View All Employees by Department', 'View all Employees by Manager', 'Update Employee Manager', 'Total Sal']
    },
])
.then(function(response) {
    switch(response.options) {
        case "View All Employees":
            viewEmployees()
            break;
        case "View All Departments":
            allDeps()
            break;
        case "View All Roles":
            allRoles()
            break;
        case "Add Employee":
            addEmployee()
            break;
        case "Add Department":
            addDep()
            break;
        case "Add Role":
            addRole()
            break;
        case "Update Employee Role":
            updateRole()
            break;
        case "Remove Employee":
            removeEmployee()
            break;
        case "Remove Department":
            removeDept()
            break;
        case "Remove Role":
            removeRole()
            break;
        case "View All Employees by Department":
            employeesByDep()
            break;
        case "View all Employees by Manager":
            employeesByManager()
            break;
        case "Update Employee Manager":
            updateManager()
            break;
        case "Total Sal":
            totalSal()
            break;
    }
});
};

//function to view all employees
function viewEmployees() {
    connection.query(`
    SELECT employee.id AS ID, employee.first_name AS FirstName, 
        employee.last_name AS LastName, 
        employee_role.title AS Role, 
        employee_role.salary AS Salary, 
        department.department_name AS Department,
        manager.last_name AS Manager
    FROM employee
    INNER JOIN department 
    ON department.id = employee.role_id 
    LEFT JOIN employee_role 
    ON employee_role.id = employee.role_id
    INNER JOIN employee manager ON employee.manager_id = manager.id
    ORDER BY employee.id ASC`, function(err, data) { 
        if (err) throw err;
        console.table(data)
        start();
    })
};

//function to view all departments
function allDeps() {
    connection.query(
        `SELECT id AS ID, department_name AS "Department Name" FROM department ORDER BY department.id ASC`, function(err, data) { 
        if (err) throw err;
        console.table(data)
        start()
    })
};

//function to view all roles
function allRoles() {
    connection.query(
        `SELECT employee_role.id AS ID, 
            title AS "Employee Role", 
            employee_role.salary as Salary, 
            department_id AS "Dept #", 
            department_name AS "Department" 
        FROM employee_role
        INNER JOIN department
        ON department.id = department_id
        ORDER BY employee_role.id ASC
        `, function(err, data) { 
        if (err) throw err;
        console.table(data)
        start()
    })
};

//function to view employees by department
function employeesByDep() {
    let departmentQuery = "SELECT * FROM department;";   

    connection.query(departmentQuery, function (err, department) {

            if (err) throw err;

            inquirer.prompt([ 
                
                {
                    name: "depChoice",
                    type: "rawlist",
                    choices: function() {
                        var arrayOfChoices = [];
                        for (var i = 0; i < department.length; i++) {
                            arrayOfChoices.push(department[i].department_name);
                        }
                        
                        return arrayOfChoices;
                },
                    message: "Which department would you like to view employees from?",
                },
            ]).then(function (response) {
                for (var i= 0; i < department.length; i++) {
                    if (department[i].department_name === response.depChoice) {
                        response.department_id = department[i].id;
                    }
                }
                let employeeQuery = `SELECT employee.last_name AS 'Last Name', 
                employee.first_name AS 'First Name'
                FROM employee 
                INNER JOIN employee_role 
                ON employee_role.id = employee.role_id
                WHERE department_id = ${response.department_id}`
                
                connection.query(employeeQuery, function(err, data) {
                    if(err) throw err;
                    console.table(data);
                    start();
                })
            })
        })
    }    
        
//function to view employees by manager
function employeesByManager() {
    let employeeQuery = "SELECT * FROM employee;";   
    connection.query(employeeQuery, function (err, employees) {
            if (err) throw err;
            inquirer.prompt([ 
                
                {
                    name: "manChoice",
                    type: "rawlist",
                    choices: function() {
                        var arrayOfChoices = [];
                        for (var i = 0; i < employees.length; i++) {
                            arrayOfChoices.push(`${employees[i].first_name} ${employees[i].last_name}`);
                        }
                        
                        return arrayOfChoices;
                },
                    message: "Which manager's employees would you like to view?",
                },
    
            ]).then(function (response) {
                for (var i= 0; i < employees.length; i++) {
                    if (`${employees[i].first_name} ${employees[i].last_name}` === response.manChoice) {
                        response.manager_id = employees[i].id;
                    }
                }
            let empDisplay = `SELECT first_name AS 'First Name', last_name AS 'Last Name' FROM employee WHERE employee.manager_id = ${response.manager_id};`
            connection.query(empDisplay, function(err, data) {
                if(err) throw err;
                console.table(data);
                start();
            })     
            })
        })
    }

//function to delete employee 
function removeEmployee() {
    var employeeQuery = "SELECT * FROM employee;";
    connection.query(employeeQuery, function (err, employees) {
            if (err) throw err;
            inquirer.prompt([ 
                
                {
                    name: "removeEmployee",
                    type: "rawlist",
                    choices: function() {
                        let arrayOfChoices = [];
                        for (var i = 0; i < employees.length; i++) {
                            arrayOfChoices.push(`${employees[i].first_name} `  +  `${employees[i].last_name}`);
                        }
                        
                        return arrayOfChoices;
                },
                    message: "Which employee would you like to remove?",
            }
    ]).then (function(response) {
        connection.query("DELETE FROM employee WHERE ?", 
    {
        last_name: response.removeEmployee
    },
    function(error) { 
        //fix console
        console.log(`${response.removeEmployee} has been deleted`);
        start();
    }
    );
})
})
}

// function to delete role
function removeRole() {
    var roleQuery = "SELECT * FROM employee_role;";
    
        connection.query(roleQuery, function (err, roles) {
                if (err) throw err;
    
                inquirer.prompt([ 
                    
                    {
                        name: "removeRole",
                        type: "rawlist",
                        choices: function() {
                            let arrayOfChoices = [];
                            for (var i = 0; i < roles.length; i++) {
                                arrayOfChoices.push(roles[i].title);
                            }
                            
                            return arrayOfChoices;
                    },
                        message: "Which role would you like to rmemove?",
    
                }
        ]).then (function(response) {
            connection.query("DELETE FROM role WHERE ?", 
        {
            title: response.removeRole
        },
        function(error) { 
            console.log(`${response} has been deleted from available roles`);
            start();
        })
    })
    })
}

//function to delete dept
function removeDept() {
    var depQuery = "SELECT * FROM department;";
        connection.query(depQuery, function (err, departments) {
                if (err) throw err;
                inquirer.prompt([ 
                    
                    {
                        name: "removeDep",
                        type: "rawlist",
                        choices: function() {
                            let arrayOfChoices = [];
                            for (var i = 0; i < departments.length; i++) {
                                arrayOfChoices.push(departments[i].department_name);
                            }
                            
                            return arrayOfChoices;
                    },
                        message: "Which department would you like to remove?",
                }
        ]).then (function(response) {
            connection.query("DELETE FROM department WHERE ?", 
        {
            department_name: response.removeDep
        },
        function(error) { 
            console.log(`${response.department_name} has been deleted from available departments`);
            start();
        }
        );
    })
    })
    }
    
//function to add employee
function addEmployee() {
 let employeeQuery = "SELECT * FROM employee";
 let roleQuery = "SELECT * from employee_role";
 connection.query(employeeQuery, function (err, employees) {
    connection.query(roleQuery, function (err, roles) {
        if(err) throw err;
   
        inquirer.prompt([ 
        {
            type: "input",
            name: "firstName",
            message: "Enter the employee's first name"
        },
        {
            type: "input",
            name: "lastName",
            message: "Enter the employee's last name"
        },
        {
            name: "choice",
            type: "rawlist",
            message: "What is the employee's role?",
            choices: function() {
                let choiceArray = [];
                for (var i=0; i < roles.length; i++) {
                    choiceArray.push(roles[i].title)
                }
                return choiceArray;
            }
        },
        {
            type: "rawlist",
            name: "manager",
            message: "Who is the employee's manager?",
            choices: function() {
                
                let choiceArray = [];
                for (var i=0; i < employees.length; i++) {
                    choiceArray.push(employees[i].last_name)
                }
                return choiceArray;
            }
        },
    ]) .then(function(response) {
        
        for (var i=0; i < roles.length; i++) {
            if(roles[i].title === response.choice) {
                response.role_id = roles[i].id;
            }
        }
        for (var i=0; i < employees.length; i++) {
            if(employees[i].last_name === response.manager) {
                response.manager_id = employees[i].id;
            }
        }
        var query = "INSERT INTO employee SET ?"
        const values = {
            first_name: response.firstName,
            last_name: response.lastName,
            role_id: response.role_id,
            manager_id: response.manager_id
        }
        connection.query(query, values, function(err) {
            if(err) throw err;
            console.log(`${response.firstName} ${response.lastName} has been added!`);
            start();
        })
        });
    })
});
}

//function to add department
function addDep() {
    inquirer.prompt([ 
        {
            name: "newDep",
            type: "input",
            message: ["What is the name of the new department?"]
        },
    ]).then(function (response){
        var query = "INSERT INTO department SET ?"
        var addDep = connection.query(query, [{department_name: response.newDep}], function(err) {
            if(err) throw err;
            console.table(`${response.newDep} has been added to "Departments"!`);
            start()
        })
    })
};
    
//function to add role
function addRole() {
    let roleQuery = "SELECT * FROM employee_role;";
    let departmentQuery = "SELECT * FROM department;";
    connection.query(roleQuery, function (err, roles) {
        connection.query(departmentQuery, function (err, department) {
            if (err) throw err;
            inquirer.prompt([ 
                
                {
                        name: "newRole",
                        type: "input",
                        message: ["What role would you like to add?"]
            
                },
                {
                    name: "newSalary",
                    type: "input",
                    message: "What is the role's yearly salary?"
                },
                { 
                    name: "choice",
                    type: "rawlist",
                    choices: function() {
                        var arrayOfChoices = [];
                        for (var i= 0; i < department.length; i++) {
                            arrayOfChoices.push(department[i].department_name);
                        }
                        return arrayOfChoices;
                    },
                    message: "Which department does this role belong to?"
                },
            ]).then(function (response) {
                for (var i= 0; i < department.length; i++) {
                    if (department[i].department_name === response.choice) {
                        response.department_id = department[i].id;
                    }
                }
                var query = "INSERT INTO employee_role SET ?"
                const values = {
                    title: response.newRole,
                    salary: response.newSalary,
                    department_id: response.department_id
                }
                connection.query(query, values, function(err) {
                    if(err) throw err;
                    console.table(`${response.newRole} has been added to available roles`);
                    start();
                })
            })
        })
    })
};

//function to update employee role
function updateRole() {
    
    let employeeQuery = "SELECT * FROM employee";
    let roleQuery = "SELECT * from employee_role";
    connection.query(employeeQuery, function (err, employees) {
       connection.query(roleQuery, function (err, roles) {
           if(err) throw err;
      
           inquirer.prompt([ 
               {
                   name: "employeeName",
                   type: "rawlist",
                   message: "Which employee's role do you need to update?",
                   choices: function() {
                       let choiceArray = [];
                       for (var i=0; i < employees.length; i++) {
                           choiceArray.push(`${employees[i].first_name} ${employees[i].last_name}`)
                       }
                       return choiceArray;
                   }
       
               },
           {
               name: "newRole",
               type: "rawlist",
               message: "What is the employee's new role?",
               choices: function() {
                   let choiceArray = [];
                   for (var i=0; i < roles.length; i++) {
                       choiceArray.push(roles[i].title)
                   }
                   return choiceArray;
               }
           },
       ]) .then(function(response) {
           
           for (var i=0; i < roles.length; i++) {
               if(roles[i].title === response.newRole) {
                   response.role_id = roles[i].id;
               }
           }
           for (var i=0; i < employees.length; i++) {
               if(`${employees[i].first_name} ${employees[i].last_name}` === response.employeeName) {
                   response.id = employees[i].id;
               }
           }
       
           var query = `UPDATE employee SET employee.role_id = ${response.role_id} 
           WHERE employee.id = ${response.id}`
           connection.query(query, function(err) {
               if(err) throw err;
               console.log(`${response.employeeName}'s role has changed`);
               start();
           })
           });
       })
   });
   }
   
//function to update employee manager
function updateManager() {
    
    let employeeQuery = "SELECT * FROM employee";
   
    connection.query(employeeQuery, function (err, employees) {
           if(err) throw err;
      
           inquirer.prompt([ 
               {
                   name: "employeeName",
                   type: "rawlist",
                   message: "Which employee's manager do you need to update?",
                   choices: function() {
                       let choiceArray = [];
                       for (var i=0; i < employees.length; i++) {
                           choiceArray.push(`${employees[i].first_name} ${employees[i].last_name}`)
                       }
                       return choiceArray;
                   }
       
               },
           {
               name: "newManager",
               type: "rawlist",
               message: "Who is the employee's new manager?",
               choices: function() {
                   let choiceArray = [];
                   for (var i=0; i < employees.length; i++) {
                       choiceArray.push(`${employees[i].first_name} ${employees[i].last_name}`)
                   }
                   return choiceArray;
               }
   
           },
       ]) .then(function(response) {
           
           for (var i=0; i < employees.length; i++) {
               if(`${employees[i].first_name} ${employees[i].last_name}` === response.employeeName) {
                   response.id = employees[i].id;
               }
           }
           for (var i=0; i < employees.length; i++) {
               if(`${employees[i].first_name} ${employees[i].last_name}` === response.newManager) {
                   response.manager_id = employees[i].id;
               }
           }
       
           var query = `UPDATE employee SET employee.manager_id = ${response.manager_id} 
           WHERE employee.id = ${response.id}`
           console.log(query)
   
           connection.query(query, function(err) {
               if(err) throw err;
               console.log(`${response.employeeName}'s manager has changed`);
               start();
           })
   
           });
       })
    }
    
// function to view the total utilized budget of a department (i.e., the combined salaries of all employees in that department)
function totalSal() {
    let departmentQuery = "SELECT * FROM department;";   


    connection.query(departmentQuery, function (err, department) {

            if (err) throw err;

            inquirer.prompt([ 

                {
                    name: "depChoice",
                    type: "rawlist",
                    choices: function() {
                        var arrayOfChoices = [];
                        for (var i = 0; i < department.length; i++) {
                            arrayOfChoices.push(department[i].department_name);
                        }

                        return arrayOfChoices;
                },
                    message: "Which department would you like to view employees from?",
                },

            ]).then(function (response) {
                for (var i= 0; i < department.length; i++) {
                    if (department[i].department_name === response.depChoice) {
                        response.department_id = department[i].id;
                    }
                }

                let employeeQuery = `SELECT SUM (employee_role.salary) AS 'Total Utilized'
                FROM employee_role
                WHERE department_id = ${response.department_id}`

                connection.query(employeeQuery , function(err, data) {
                    if(err) throw err;
                    console.table(data);
                    start();
                })  
            })
        })
    }
