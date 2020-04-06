import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../src/prisma';

const userOne = {
  input: {
    name: 'Jen',
    email: 'jen@example.com',
    password: bcrypt.hashSync('nlue076#4343')
  },
  user: undefined,
  jwt: undefined
};

const userTwo = {
  input: {
    name: 'Barril',
    email: 'barrils@example.com',
    password: bcrypt.hashSync('nlue076#4343')
  },
  user: undefined,
  jwt: undefined
};

const seedDatabase = async () => {
  // Delete test data
  await prisma.mutation.deleteManyUsers();

  // Create user one
  userOne.user =  await prisma.mutation.createUser({
    data: userOne.input
  });
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.PRISMA_JWT_SECRET);

  // Create user two
  userTwo.user =  await prisma.mutation.createUser({
    data: userTwo.input
  });
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.PRISMA_JWT_SECRET);
}

export { seedDatabase as default, userOne, userTwo };