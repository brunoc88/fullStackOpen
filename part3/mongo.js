const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url =
  `mongodb+srv://brunocerutti88:${password}@cluster0.ibed0.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url)
  .then(() => {
    console.log('Database connected!');

    //3.12
    if (!name || !number) {
      return Person.find({})
        .then(persons => {
          console.log("phonebook:");
          persons.forEach(p => {
            console.log(`${p.name} ${p.number}`);
          });
          mongoose.connection.close();
        });
    }

    
    const person = new Person({
      name,
      number
    });

    return person.save()
      .then(() => {
        console.log(`added ${name} number ${number} to the phonebook`);
        mongoose.connection.close();
      });
  })
  .catch(error => {
    console.error(error);
    mongoose.connection.close();
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);
