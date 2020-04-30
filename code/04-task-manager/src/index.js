const app = require('./app');
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server steht auf Port ${port}`);
});
