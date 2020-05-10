This project will show the learning outcome cloud services

It also tackles a problem we have within my own company. Because we have a ticket platform, there will be a lot of inserts and mutations to the current statistic rows. We care the most about reads for the product because clients want to have a fast response time. It doesnt matter in what time the mutations get processed. For now we made it so existing statistics get updated for every time window. You can imagine that this produces a lot of rows. So I want to remove the updating in the statistics rows completely by only having one

UI:

- contains the buttons which create events

API:

- Has two modules
- Has a queue that works in the background and apply's the events

Database (Postgres w/ TimeScale extension):

- A hypertable for all events
- A normal table for the statistic total
