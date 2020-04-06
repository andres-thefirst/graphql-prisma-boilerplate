import  bcryptjs from 'bcryptjs';

import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

const Mutation = {
  async createUser(parent, args, {prisma}, info) {
  const {data} = args;
  const password = await hashPassword(data.password);
  const user = await prisma.mutation.createUser({ 
      data: {
        ...data,
        password
      }
    });

    return {
      token: generateToken(user.id),
      user
    }
  },
  async deleteUser(parent, args, {prisma, request}, info) {
    const userId = getUserId(request);

    return prisma.mutation.deleteUser( {
      where: {
        id: userId
      }
    }, info);
  },
  async updateUser(parent, args, {prisma, request}, info) {
    const userId = getUserId(request);
    const {data} = args;

    if (typeof data.password === 'string') {
      data.password = await hashPassword(data.password);
    }

    return prisma.mutation.updateUser({
      where: {
        id: userId
      },
      data
    }, info);
  },
  async login(parent, args, {prisma}, info) {
    const {data} = args;
    const user = await prisma.query.user({where:{ email: data.email }});
    if (!user) {
      throw new Error("Unable to login");
    }

    const isMatch = await bcryptjs.compare(data.password, user.password);

    if (!isMatch) {
      throw new Error("Unable to login");
    }

    return {
      token: generateToken(user.id),
      user
    }
  }
}

export {Mutation as default};