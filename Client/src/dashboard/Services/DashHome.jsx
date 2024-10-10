import React, { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Table from "../../components/Table/Table";
import { getService } from "../../services/user.services";

const DashServices = () => {
  const [list, setList] = useState([]);
  const [text, setText] = useState("");
  const handleSearch = (e) => {
    setText(e.target.value);
  };
  const [trigger, setTrigger] = useState(false);
  const router = useHistory();
  const titleArray = ["Service Title", "Description"];
  const fields = ["title", "description"];
  const serviceList = async () => {
    const [response] = await getService();
    if (response) {
      setList(response.data);
    }
  };

  useEffect(() => {
    serviceList();
  }, [trigger]);

  return (
    <div>
      <div className="flex justify-end w-full  my-2">
        <div
          className="px-3 rounded w-max py-2 bg-accent text-white"
          onClick={() => router.push("/admin/dashboard/services/create")}
        >
          Add Services
        </div>
      </div>
      <Table
        titleArray={titleArray}
        fields={fields}
        handleSearch={handleSearch}
        list={list.filter((val) =>
          text ? val.title.toUpperCase().includes(text.toUpperCase()) : true
        )}
        trigger={setTrigger}
      />{" "}
    </div>
  );
};

export default DashServices;
