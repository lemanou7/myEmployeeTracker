const inquirer = require('inquirer');

const connection = require('../config/connection')

require("console.table");


//MAIN PROMPT ASKING USER WHAT ACTION TO TAKE
function mainPrompt() {

    inquirer
      .prompt({
        type: "list",
        name: "task",
        message: "What Would you like to do?",
        choices: [
          "View Employees",
          "View Employees by Department",
          "Add Employee",
          "Add Role",
          "Remove Employees",
          "Update Employee Role",
          "End"]
      })
      .then(function ({ task }) {
        switch (task) {
          case "View Employees":
            viewEmployee();
            break;
          case "View Employees by Department":
            viewEmployeeByDepartment();
            break;
          case "Add Employee":
            addEmployee();
            break;
          case "Remove Employees":
            removeEmployees();
            break;
          case "Update Employee Role":
            updateEmployeeRole();
            break;
          case "Add Role":
            addRole();
            break;
  
          case "End":
            connection.end();
            break;
        }
      });
  }
  
//DISPLAYING EMPLOYEES MAIN TABLE

function viewEmployee() {
    console.log("Viewing employees table\n");
    var sql =
      `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r
      ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
      ON m.id = e.manager_id`
  
    connection.query(sql, function (err, res) {
      if (err) throw err;
      
      //Display result in a table format
      console.table(res);
      
      mainPrompt();
    });
    
  }
  
  
  
  // ADD ALL DEPARTMENT INTO AN ARRAY
  
  function viewEmployeeByDepartment() {
    console.log("Viewing employees by department\n");
  
    var sql =
      `SELECT d.id, d.name, r.salary AS budget
    FROM employee e
    LEFT JOIN role r
      ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`
  
    connection.query(sql, function (err, res) {
      if (err) throw err;

      //CREATING THE LIST OF ALL DEPARTMENT
      const departmentChoices = res.map(data => ({
        value: data.id, name: data.name
      }));
  
      console.table(res);
      console.log("Department view succeed!\n");
  
      promptDepartment(departmentChoices);
    });
   
  }
  
  // Department choices sub-prompt
  
  function promptDepartment(departmentChoices) {
  
    inquirer
      .prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Which department would you choose?",
          choices: departmentChoices
        }
      ])
      .then(function (answer) {
        console.log("answer ", answer.departmentId);
  
        var sql =
          `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
    FROM employee e
    JOIN role r
      ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    WHERE d.id = ?`
  
        connection.query(sql, answer.departmentId, function (err, res) {
          if (err) throw err;
  
          console.table("response ", res);
          console.log(res.affectedRows + "Employees are viewed!\n");
  
          mainPrompt();
        });
      });
  }
  
  //INSERTING A NEW EMPLOYEE IN THE DATABASE
  function addEmployee() {
    console.log("Inserting an employee in the database!")
  
    var sql =
      `SELECT r.id, r.title, r.salary 
        FROM role r`
  
    connection.query(sql, function (err, res) {
      if (err) throw err;
      
      //GENERATING A LIST OF ALL ROLE IN NEW ARRAY
      const employeeRoles = res.map(({ id, title, salary }) => ({
        value: id, title: `${title}`, salary: `${salary}`
      }));
      
      //Displaying all Role in a table
      console.table(res);

     //Calling New Prompt 
      promptInsert(employeeRoles);
    });
  }
  

// FUNCTION TO INSERT NEW EMPLOYEE
  function promptInsert(employeeRoles) {
  
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What is the employee's first name?"
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the employee's last name?"
        },
        {
          type: "list",
          name: "roleId",
          message: "What is the employee's role?",
          choices: employeeRoles
        },
        
      ])
      .then(function (answer) {
        console.log(answer);
  
        var sql = `INSERT INTO employee SET ?`
        // USE USER INFO TO CREATE A NEW EMPLOYEE OBJECT
        connection.query(sql,
          {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: answer.roleId,
            manager_id: answer.managerId,
          },
          function (err, res) {
            if (err) throw err;
  
            console.table(res);
            console.log(res.insertedRows + "Inserted successfully!\n");
  
            mainPrompt();
          });
        
      });
  }
  
  
  //FUNCTION TO DELETE AN EMPLOYEE FROM THE DATABASE
  function removeEmployees() {
    console.log("Removing an employee !");
  
    var sql =
      `SELECT e.id, e.first_name, e.last_name
        FROM employee e`
  
    connection.query(sql, function (err, res) {
      if (err) throw err;
      
      //GET EMPLOYEES INTO NEW ARRAY
      const EmployeeChoices = res.map(({ id, first_name, last_name }) => ({
        value: id, name: `${id} ${first_name} ${last_name}`
      }));
  
      console.table(res);
      console.log("ArrayToDelete!\n");
  
      promptDelete(EmployeeChoices);
    });
  }
  
  // CHOICE EMPLOYEE TO BE DELETED
  
  function promptDelete(EmployeeChoices) {
  
    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee do you want to remove?",
          choices: EmployeeChoices
        }
      ])
      .then(function (answer) {
  
        var sql = `DELETE FROM employee WHERE ?`;
        
        //DELETE ACCORDING TO EMPLOYEE ID
        connection.query(sql, { id: answer.employeeId }, function (err, res) {
          if (err) throw err;
  
          console.table(res);
          console.log(res.affectedRows + "Deleted!\n");
  
          mainPrompt();
        });
        
      });
  }
  
  
  //UPDATING EMPLOYEE INTO THE DATABASE
  
  function updateEmployeeRole() { 
    employeeArray();
  
  }
  
  function employeeArray() {
    console.log("Updating an employee");
  
    var sql =
      `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    JOIN role r
      ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    JOIN employee m
      ON m.id = e.manager_id`
  
    connection.query(sql, function (err, res) {
      if (err) throw err;
  
      const employeeChoices = res.map(({ id, first_name, last_name }) => ({
        value: id, name: `${first_name} ${last_name}`      
      }));
  
      console.table(res);
      console.log("employeeArray To Update!\n")
  
      roleArray(employeeChoices);
    });
  }
  
  
  function roleArray(employeeChoices) {
    console.log("Updating an role");
  
    var query =
      `SELECT r.id, r.title, r.salary 
    FROM role r`
    let roleChoices;
  
    connection.query(query, function (err, res) {
      if (err) throw err;
  
      roleChoices = res.map(({ id, title, salary }) => ({
        value: id, title: `${title}`, salary: `${salary}`      
      }));
  
      console.table(res);
      console.log("roleArray to Update!\n")
  
      promptEmployeeRole(employeeChoices, roleChoices);
    });
  }
  
  function promptEmployeeRole(employeeChoices, roleChoices) {
  
    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee do you want to set with the role?",
          choices: employeeChoices
        },
        {
          type: "list",
          name: "roleId",
          message: "Which role do you want to update?",
          choices: roleChoices
        },
      ])
      .then(function (answer) {
  
        var query = `UPDATE employee SET role_id = ? WHERE id = ?`
        // when finished prompting, insert a new item into the db with that info
        connection.query(query,
          [ answer.roleId,  
            answer.employeeId
          ],
          function (err, res) {
            if (err) throw err;
  
            console.table(res);
            console.log(res.affectedRows + "Updated successfully!");
  
            mainPrompt();
          });
        // console.log(query.sql);
      });
  }
  
  
  
  //7."Add Role" / CREATE: INSERT INTO
  
  function addRole() {
  
    var query =
      `SELECT d.id, d.name, r.salary AS budget
      FROM employee e
      JOIN role r
      ON e.role_id = r.id
      JOIN department d
      ON d.id = r.department_id
      GROUP BY d.id, d.name`
  
    connection.query(query, function (err, res) {
      if (err) throw err;
  
      // 
      const departmentChoices = res.map(({ id, name }) => ({
        value: id, name: `${id} ${name}`
      }));
  
      console.table(res);
      console.log("Department array!");
  
      promptAddRole(departmentChoices);
    });
  }
  
  function promptAddRole(departmentChoices) {
  
    inquirer
      .prompt([
        {
          type: "input",
          name: "roleTitle",
          message: "Role title?"
        },
        {
          type: "input",
          name: "roleSalary",
          message: "Role Salary"
        },
        {
          type: "list",
          name: "departmentId",
          message: "Department?",
          choices: departmentChoices
        },
      ])
      .then(function (answer) {
  
        var query = `INSERT INTO role SET ?`
  
        connection.query(query, {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.departmentId
        },
          function (err, res) {
            if (err) throw err;
  
            console.table(res);
            console.log("Role Inserted!");
  
            mainPrompt();
          });
  
      });
  }
  
  
module.exports = {
    mainPrompt
  }
 