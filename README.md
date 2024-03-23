
# MERN Stack Coding Challenge for Roxiler Systems

## Overview

This project is a MERN stack application completed for Roxiler Systems. It fetches data from a third-party API, initializes the database, and provides backend APIs for listing transactions, generating statistics, and creating charts. The frontend displays transaction data in a table, along with statistics, a bar chart, and a pie chart, all customizable by month.


## Live Project

The Project is live on : https://roxiler-systems-challenge.netlify.app/

For deployment, Render.com and Netlify.com's free tier services were used. Please note that initial rendering might take slightly longer due to this.

## API Reference 

#### Initialize database with seed data


```http
  GET /api/v1/transactions/initializedb
```

#### Get List of transactions

```http
  GET /api/v1/transactions/list
```

| Query_Parameter | Type     | Description                |
| :-------------- | :------- | :------------------------- |
| `month`  | `string` | **Required**. Gets Items for the specified month. |
| `search`  | `string` | Optional. Search term for filtering Items.|
| `page`  | `number` | Optional. Gets specified page number for pagination. By default 1|
| `perPage`  | `number` | Optional. Gets specified number of Items in per page. By default 10|



#### Get statistics

```http
  GET /api/v1/transactions/statistics
```

| Query_Parameter | Type     | Description                |
| :-------------- | :------- | :------------------------- |
| `month`  | `string` | **Required**. Gets statistics for ths specified month.|



#### Get Bar Chart

```http
  GET /api/v1/transactions/barchart
```

| Query_Parameter | Type     | Description                |
| :-------------- | :------- | :------------------------- |
| `month`  | `string` | **Required**. Gets Bar chart month for specified month. |


#### Get Pie Chart

```http
  GET /api/v1/transactions/piechart
```

| Query_Parameter | Type     | Description                |
| :-------------- | :------- | :------------------------- |
| `month`  | `string` | **Required**. Gets pie chart month for specified month. |



## Run Locally

Clone the project

```bash
 git clone https://github.com/SalefDesai/Roxiler-Systems-Challenge.git
```

Navigate to client directory

```bash
  cd client
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


Navigate to server directory

```bash
  cd server
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```




## Tech Stack

**Client:** React, Chakra UI, react-apexcharts

**Server:** Node, Express, Mongoose




## Feedback

If you have any feedback, please reach me out at salef.desai@gmail.com

