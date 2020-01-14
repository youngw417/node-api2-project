const server = require('./api/server');




const port = 4001;

server.listen(port, () => {
    console.log(`\n*** Server is running on port ${port} *** \n`)
})