const inquirer = require("inquirer");
const fs = require('fs');
const axios = require("axios");
const path = require("path");
const convertFactory = require('electron-html-to');
const conversion = convertFactory({
    converterPath: convertFactory.converters.PDF
});

inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is your GitHub username?"
    },
    {
      type: "checkbox",
      message: "What's your favorite shape?",
      name: "shape",
      choices: [
        "octagon", 
        "rhombus", 
        "parallelogram", 
      ]
    }
  ]).then(function(user) {

    let userShape = user.shape
    let userName = user.name
    // console.log(userShape[0])
    // console.log(user.name)

    const queryUrl = `https://api.github.com/users/${userName}/repos?per_page=100`;

    axios
      .get(queryUrl)
      .then(res => {
        console.log(res.data);
        const repos = [];
        for (let i = 0; i < res.data.length; i++){
          console.log(res.data[i].name)
          repos.push(res.data[i].name)
        }
        // console.log(repos)
        console.log(repos.length)
        const reposNumber = repos.length;
        console.log(reposNumber)

        var filename = userName.toLowerCase().split(' ').join('') + ".json";

    //const user = require(`./${user.name}.json`)
    //console.log(user.name)
  
    fs.writeFile(filename, JSON.stringify(user, null, '\t'), function(err) {
  
      if (err) {
        return console.log(err);
      }
  
      console.log("Success!");

      console.log(__dirname);

      conversion({ html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>NODE PDF PORTFOLIO</title>
          <link href="https://fonts.googleapis.com/css?family=Bebas+Neue&display=swap" rel="stylesheet"> 
          <style>
              html {
                -webkit-print-color-adjust: exact;
              }
          
              body {
                font-family: 'Bebas Neue', cursive;
            }
            
            .page {
                display: grid;
                justify-content: center;
            }
            
            header {
                display: grid;
                height: 40vh;
                width: 95vw;
            }
            
            .octagon {
                clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%); 
            }
            
            .rhombus {
                clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
            }
            
            .parallelogram {
                clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);
            }
            
            .photo {
                // background-image: url(photo.jpg);

                background-position: center;
                background-repeat: no-repeat;
                background-size: cover;
                width: 200px;
                height: 200px;
                margin: 25px;
            }
            
            .name {
                justify-self: center;
                align-self: center;
            }
            
            .shape {
                height: 50px;
                width: 50px;
                background-color: black;
                margin: 5px;
            }
            
            .git-hub {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                grid-template-rows: 1fr 1fr;
            }
            
            .git-hub-info {
                display: grid;
                grid-auto-flow: column;
                justify-content: center;
                align-content: center;
            }
            
            .text {
                align-self: center;
            }
            
            .repos {
                grid-column: 1 / 2;
                grid-row: 1 / 2;
    
            }
            
            .stars {
                grid-column: 1 / 2;
                grid-row: 2 / 3;
            }
            
            .photo {
                grid-column: 2 / 3;
                grid-row: 1 / 3;
                align-self: center;
                justify-self: center;
            }
            
            .followers {
                grid-column: 3 / 4;
                grid-row: 1 / 2;
            }
            
            .following {
                grid-column: 3 / 4;
                grid-row: 2 / 3;
            }
          </style>
      </head>
      <body>
          <div class="page">
              <header>
                  <div class="name"><h1> ${userName}</h1></div>
              </header>
              <div class="git-hub">
                  <div class="git-hub-info repos">
                      <div class= "shape ${userShape[0]}"></div>
                      <div class="text">Public Repositories <span id="repo">${reposNumber}</span></div>
                  </div>
                  <div class="git-hub-info stars">
                      <div class="shape ${userShape[0]}"></div>
                      <div class="text">GitHub Stars <span id="stars">65</span></div> 
                  </div>
                  <div class="photo ${userShape[0]}"></div>
                  <div class="git-hub-info following">
                      <div class="shape ${userShape[0]}"></div>
                      <div class="text">Followers <span id="repo">92</span></div>
                      
                  </div>
                  <div class="git-hub-info followers">
                      <div class="shape ${userShape[0]}"></div>
                      <div class="text">Following <span id="repo">65</span></div>
                  </div>
              </div>
          </div> 
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
          <script src="index.js"></script>
      </body>
      </html> ` }, function(err, result) {
        if (err) {
          return console.error(err);
        }
    
        result.stream.pipe(
            fs.createWriteStream(path.join(__dirname, `${userName}.pdf`))
        );
        conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
      });
  
        });
      });
  });
