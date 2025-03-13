import axiosInstance from "../axios";

export const loginService = async (body) => {
  try {
    const response = await axiosInstance.post("user/login", body);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const createUser = async (body) => {
  try {
    const response = await axiosInstance.post("user/register", body);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const updateUser = async (id, body) => {
  try {
    const response = await axiosInstance.patch(`user/${id}`, body);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const updatePassword = async (id, body) => {
  try {
    const response = await axiosInstance.patch(`user/password/${id}`, body);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const updateEmail = async (id, body) => {
  try {
    const response = await axiosInstance.post(`user/updateEmail/${id}`, body);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};
export const createService = async (body) => {
  try {
    const response = await axiosInstance.post("serviceCategory", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const editService = async (body, id) => {
  try {
    const response = await axiosInstance.patch(`serviceCategory/${id}`, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const deleteService = async (id) => {
  try {
    const response = await axiosInstance.delete(`serviceCategory/${id}`);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};
export const deleteAdmin = async (id) => {
  try {
    const response = await axiosInstance.delete(`user/${id}`);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const getService = async () => {
  try {
    // console.log("entering getService");
    const response = await axiosInstance.get("serviceCategory");
    // console.log("getService", response); // yeha error xa
    return [response, null];
  } catch (error) {
    // console.log("direct error in getService");
    return [null, error];
  }
};

export const getServiceById = async (id) => {
  try {
    const response = await axiosInstance.get(`serviceCategory/${id}`);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const createAdmin = async (body) => {
  try {
    const response = await axiosInstance.post("user/admin", body);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const activateUser = async (body) => {
  try {
    const response = await axiosInstance.post("user/activate", body);
    // console.log("response", response);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const logOutUser = async (body) => {
  try {
    const response = await axiosInstance.post("user/logout");
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const getMyOrders = async () => {
  try {
    console.log("entering getMyOrders");
    const response = await axiosInstance.get("serviceOrder/myOrders");
    // console.log("getMyOrders", response);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};
export const getActiveOrders = async () => {
  try {
    const response = await axiosInstance.get("serviceOrder/active");
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const forgotPassword = async (body) => {
  try {
    const response = await axiosInstance.post("user/forgotPassword", body);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const switchPassword = async (body) => {
  try {
    const response = await axiosInstance.patch("user/resetPassword", body);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const switchEmail = async (body) => {
  try {
    const response = await axiosInstance.patch("user/resetEmail", body);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};
