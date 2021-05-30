
# Anomaly Detection WebApp

link to github - https://github.com/Liron-w/anomaly_web_app  
link to an explanatory video - https://youtu.be/o4EUcoQuqkY

## Summary:
A web App server that implements a REST-API for the clients and single web page.    
there is two ways to connect the server:  
1. by the web app:
    A browser opens at localhost:8080  
    The user selected a valid CSV file without anomalies (train file) and a file with anomalies (test file).  
    After clicking on upload, the files are uploaded to the server,     
    where an anomaly is detected and the output with the anomaly report appears on the same page.  
    This is done using the HTTP POST command and a JSON file is retrieved which includes a report of where the anomalies occurred.  
2. the client can connect directly to the server.

# Prerequisites
Windows environment to run the code.

# Installing
Install node.js - https://nodejs.org/en/  
In the terminal – run the command "npm i" , this will install all the downloads required.

## Running  
in the web app:  
a. in the terminal, write - 'cd controller' and then 'node expServer.js'. 
b. Click the ‘upload normal CSV file’ button, add reg_flight.csv  file with all flight data.  
c. Click the ‘upload train CSV file add the anomaly_flight.csv file.  
d. Choose an algorithm - hybrid or regression.  
e. Click the ‘submit' button.  
f. The anomaly reports will be displayed on the screen.  
directly:
a. you can run the 'post' and 'get' command directly in the browser or in web like 'post-man'.  

## Documentation and general explanation of the structure of the folders and main files in the project:
Architecture - MVC:  
**View:**  
This is a simple web page (HTML) with a form that includes a drop-down list for selecting the algorithm,   
two input fields to select files, and an inner frame for displaying the output.  
**Controller:**  
For the get http command to “/” the controller will return to the browser the HTML form defined by the view.   
the post http command to the "detect" controller decodes the request and instructs the model to perform the calculation.  
When the result is returned (as JSON) the controller instructs view to create the desired output.  
**Model:**  
The model implement the anomaly detection algorithm  

## Collaborators
This program was developed by four student, Hila Shechter, Shoval Harel, Liron Weizman and Sapir Vaisman, CS students in Bar-Ilan university, Israel.

