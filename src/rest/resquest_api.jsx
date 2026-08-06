import axios from "../rest/axios";

export const getAllTransactionRequest = async (user) => {
  try {
    const response = await axios.get(
      "https://bankteller-api.vercel.app/allTransactions",
      {
        params: { user: user },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addTransactionRequest = async (newTransaction) => {
  console.log(newTransaction);
  try {
    const response = await axios.post(
      "https://bankteller-api.vercel.app/transactions",
      newTransaction,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const getTransactionRequest = async (transaction) => {
  try {
    const response = await axios.post(
      "https://bankteller-api.vercel.app/transaction",
      transaction,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const editTransactionRequest = async (newTransaction) => {
  console.log(newTransaction);
  try {
    const response = await axios.put(
      "https://bankteller-api.vercel.app/transaction",
      newTransaction,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const loginRequest = async (user) => {
  try {
    const response = await axios.post(
      "https://bankteller-api.vercel.app/login",
      user,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response.data);
    return response;
  } catch (error) {
    console.error(
      "❌ Error en la solicitud de login:",
      error.response?.data || error.message,
    );

    return { error: error.response?.data?.message || "Error desconocido" };
  }
};

export const getUsersRequest = async () => {
  try {
    const response = await axios.get("https://bankteller-api.vercel.app/users");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const createUserRequest = async (user) => {
  console.log(user);
  try {
    const response = await axios.post(
      "https://bankteller-api.vercel.app/register",
      user,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const editUserRequest = async (newUser) => {
  console.log(newUser);
  try {
    const response = await axios.put(
      "https://bankteller-api.vercel.app/user",
      newUser,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const deleteUserRequest = async (user) => {
  try {
    const response = await axios.delete(
      "https://bankteller-api.vercel.app/user",
      {
        headers: {
          "Content-Type": "application/json",
        },
        data: { _id: user },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const getBalanceRequest = async (user) => {
  console.log(user);
  try {
    const response = await axios.get(
      "https://bankteller-api.vercel.app/balances",
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const addBalanceRequest = async (balance) => {
  console.log(balance);
  try {
    const response = await axios.post(
      "https://bankteller-api.vercel.app/balance",
      balance,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const deleteBalanceRequest = async () => {
  try {
    const response = await axios.delete(
      "https://bankteller-api.vercel.app/balances",
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const deleteTransactionsRequest = async () => {
  try {
    const response = await axios.delete(
      "https://bankteller-api.vercel.app/transactions",
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const addClient = async (client) => {
  console.log(client);
  try {
    const response = await axios.post(
      "https://bankteller-api.vercel.app/client",
      client,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const editClient = async (newClient) => {
  console.log(newClient);
  const ci = newClient.ci;
  console.log(`https://bankteller-api.vercel.app/client/${ci}/update`);
  try {
    const response = await axios.put(
      `https://bankteller-api.vercel.app/client/${ci}/update`,
      newClient,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);

    console.error(error.response.headers);
    console.error(error.response.data);
  }
};

export const getAllClients = async () => {
  try {
    const response = await axios.get(
      "https://bankteller-api.vercel.app/clients"
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const getClient = async (ci) => {
  try {
    const response = await axios.get(
      `https://bankteller-api.vercel.app/client/${ci}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const getExchangeDollar = async () => {
  try {
    const response = await axios.get(
      `https://paralelo.bo/api/v1/rate`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};