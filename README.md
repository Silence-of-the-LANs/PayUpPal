# PayUpPal

A progressive web app utilizing machine learning that allows users to track shared expenses and request payments. Users can upload receipts, which will then be parsed and presented to the user. Users can then edit and indicate which friends to include on the expense. The user can choose to split the expense evenly, or assign friends to various items. To assign friends, users have access to a manageable friends list. In addition, users can view and track their money owed - according to receipt or by friend - and also reminders to their friends. If the user ever loses a receipt, they will have access to a copy in our app via the receipt history feature.

## Deployed App

<a href="https://payuppal.herokuapp.com"> PayUpPal </a>

## Screenshots

![Screenshot](https://payuppal-site-images.s3.amazonaws.com/payuppal-resizedforgit.jpg)

![ScanningReceipt](https://payuppal-site-images.s3.amazonaws.com/mobileforgit.gif)

## Video Demo

<a href=''> Youtube Video </a>

## Tech-Stack

The front-end is built using React, Material-UI, JavaScript, HTML and CSS. The backend is built with Node, Express, Sequelize, PostgresSQL, and Amazon S3. For text detection, the app utilizes Google Vision API. Reminder notifications for the app are sent using Nodemailer and Twilio, and user sessions are managed with Passport.js.

<table>
      <thead>
        <tr>
          <th>Front End</th>
          <th>Back End</th>
          <th>APIs</th>
          <th>Libraries</th>
        </tr>
      </thead>
      <tbody>
            <tr>
              <td>React</td>
              <td>Node.js</td>
              <td>Google Vision</td>
              <td>Nodemailer</td>    
            </tr>
            <tr>
              <td>Material-UI</td>
              <td>Express</td>
              <td>Amazon S3</td>
              <td></td>
            </tr>
            <tr>
              <td>HTML & CSS</td>
              <td>PostgreSQL</td>
              <td>Twilio</td>
              <td></td>                  
            </tr>
            <tr>
              <td></td>
              <td>Sequelize</td>
              <td></td>
              <td></td>                  
            </tr>
      </tbody>
  </table>
  
## Our Team

<table>
      <thead>
        <tr>
          <th>Full Name</th>
          <th>GitHub</th>
          <th>LinkedIn</th>
        </tr>
      </thead>
      <tbody>
            <tr>
              <td>Jason Liao</td>
              <td><a href="https://github.com/jlfliao">jlfliao</a></td>
              <td><a href="https://www.linkedin.com/in/jasonliao1/">Jason Liao</a></td>
            </tr>
            <tr>
              <td>Tommy Liu</td>
              <td><a href="https://github.com/tommyliu625">tommyliu625</a></td>
              <td><a href="https://www.linkedin.com/in/tommyliu625/">Tommy Liu<a/></td>
            </tr>
            <tr>
              <td>Zoran Bajic</td>
              <td><a href="https://github.com/ZoransFullstack">ZoranFullstack</a></td>
              <td><a href="https://www.linkedin.com/in/zoranbajic/">Zoran Bajic<a/></td>
            </tr>
      </tbody>
  </table>
  
  ## Installation

* To install all the dependencies: `npm run install`
* To create the database and seed: `createdb payuppal`
* To seed the database with products and accounts: `npm run seed`
* To run the app: `npm run start-dev`

** Note: You will need to obtain your own API keys. **
