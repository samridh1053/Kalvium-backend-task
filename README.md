# Math Operation Server Documentation

The Math Operation Server is a simple web application that allows you to perform basic mathematical operations via URLs and provides a history of your calculations. You can also view the history of your calculations, clear the history, and calculate the average of the results.
See the demo video here: [Demo video](https://www.loom.com/share/e90887bfc2624b99bf66eb85846a3288?sid=aa8b1b71-fe14-4008-88f5-c686120ca021)

## Getting Started

1. **Installation**: Make sure you have Node.js installed on your machine.

2. **Clone the Repository**: Clone this repository to your local machine.

3. **Start the Server**: Run the following command to start the server:
   `node server.js`

The server will be accessible at http://localhost:3000.

## Using the Math Operation Server

### Website Interface

- Access the Math Operation Server's website interface by visiting http://localhost:3000/.
- The website provides an interactive interface for performing calculations, viewing history, clearing history, and calculating averages.
- To perform a calculation, click on the links provided under "Click on the links below for sample operations."

### Performing Math Operations

To perform mathematical operations, you can use the website's interface or compose URLs using numbers and operators as follows:

- Addition: `/num1/plus/num2`
- Subtraction: `/num1/minus/num2`
- Multiplication: `/num1/into/num2`
- Modulus: `/num1/mod/num2`
- Division: `/num1/divide/num2`
- Exponentiation: `/num1/power/num2`

Replace `num1` and `num2` with your desired numbers and use the respective operator keywords.

### Additional Mathematical Operations

In addition to the basic operations, the Math Operation Server also supports the following additional operations:

- Modulus: Use the `mod` operator to find the remainder of a division.
- Division: Use the `divide` operator to perform division between numbers.
- Exponentiation: Use the `power` operator to calculate the power of a number.
### Viewing History

- To view the history of calculations, click on the "View History" link on the website or visit: http://localhost:3000/history.
- The history table displays the questions and their answers.

### Clearing History

- To clear the history, click on the "Clear History" link on the website or visit: http://localhost:3000/clear-history.
- After clearing, the history will be empty.

### Calculating Average

- To calculate the average of the results, click on the "Calculate Average" link on the website or visit: http://localhost:3000/average.
- The average of all calculated results will be displayed.

### Persistence of History

- The history of calculations is stored in a JSON file (`history.json`).
- Even if the server is restarted, the history data remains intact and accessible.

## Credits

Math Operation Server was created using Express.js and Node.js.
