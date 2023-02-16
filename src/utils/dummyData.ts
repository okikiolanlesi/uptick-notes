interface IDummyData {
  users: {
    user1: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    };
    user2: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    };
  };
  notes: {
    note1: {
      title: string;
      body: string;
    };
    note2: {
      title: string;
      body: string;
    };
  };
}

const dummyData: IDummyData = {
  users: {
    user1: {
      email: "johndoe@gmail.com",
      password: "password",
      firstName: "John",
      lastName: "Doe",
    },
    user2: {
      email: "janedoe@gmail.com",
      password: "password",
      firstName: "Jane",
      lastName: "Doe",
    },
  },
  notes: {
    note1: {
      title: "Note title",
      body: "Note body",
    },
    note2: {
      title: "Note title 2",
      body: "Note body 2",
    },
  },
};

export default dummyData;
