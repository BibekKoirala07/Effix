import axiosInstance from "../axios";

export const orderService = async (body) => {
  try {
    const response = await axiosInstance.post("serviceOrder", body);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const activeRequests = async (body) => {
  try {
    const response = await axiosInstance.post(
      "serviceOrder/getByCategories",
      body
    );
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const acceptOrder = async (body) => {
  try {
    const response = await axiosInstance.post(`serviceOrder/accept/${body}`);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const orderStatus = async (body) => {
  try {
    const response = await axiosInstance.get("serviceOrder/accepted", body);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const updateStatus = async (type, body) => {
  try {
    const response = await axiosInstance.post(`serviceOrder/${type}/${body}`);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const withdrawOrder = async (id) => {
  try {
    const response = await axiosInstance.post(`serviceOrder/withdraw/${id}`);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const getSingleService = async (body) => {
  try {
    const response = await axiosInstance.get(`serviceCategory/${body}`);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const paymentOption = async (body) => {
  try {
    const response = await axiosInstance.post(`serviceOrder/pay/${body}`);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const deleteOrder = async (body) => {
  try {
    const response = await axiosInstance.delete(`serviceOrder/${body}`);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const getTechnicianList = async () => {
  try {
    const response = await axiosInstance.get(`user?role=technician`);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const getAdminList = async () => {
  try {
    const response = await axiosInstance.get(`user?role=admin`);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const updateStatusToCompleted = async (type, body) => {
  try {
    const response = await axiosInstance.post(`serviceOrder/complete/${type}`, {
      amount: body,
    });
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const requestPayment = async (body) => {
  try {
    const response = await axiosInstance.post(`user/requestPayment`, body);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};
