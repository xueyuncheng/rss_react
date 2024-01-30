"use client";
import React, { useEffect, useState } from "react";
import {
  AddRSS,
  DeleteRSS,
  GetRSS,
  ListRSS,
  RSSField,
  UpdateRSS,
} from "../api/rss";
import Loading from "../component/loading";
import Error from "../component/error";

function RSSApp() {
  const { data, mutate, isLoading, error } = ListRSS();

  return (
    <div className="ml-10">
      <h1 className="">RSS 列表</h1>
      {isLoading && <Loading />}
      {error && <Error />}
      {data && <RSSList rsses={data.data.items} reload={() => mutate()} />}
    </div>
  );
}

type RSSListProps = {
  rsses: RSSField[];
  reload: () => void;
};

function RSSList({ rsses, reload }: RSSListProps) {
  const [show, setShow] = useState(false);
  const [id, setID] = useState(0);

  return (
    <div>
      <button
        type="button"
        className="btn btn-sm -ml-3 my-2"
        onClick={() => {
          setID(0);
          setShow(true);
        }}
      >
        添加RSS源
      </button>
      {show && (
        <RSSForm
          id={id}
          hideModal={() => {
            setShow(false);
            reload();
          }}
        />
      )}
      <ol className="list-decimal">
        {rsses.map((rss) => (
          <RSS
            key={rss.id}
            rss={rss}
            setID={setID}
            setShow={setShow}
            reload={reload}
          />
        ))}
      </ol>
    </div>
  );
}

type RSSProps = {
  rss: RSSField;
  setID: (id: number) => void;
  setShow: (show: boolean) => void;
  reload: () => void;
};

function RSS({ rss, setID, setShow, reload }: RSSProps) {
  const handleDeleteRSS = async (id: number) => {
    await DeleteRSS(id);

    reload();
  };

  return (
    <li key={rss.id}>
      {rss.name} ({rss.url})
      <button
        className="btn btn-sm ml-2"
        onClick={() => {
          setID(rss.id);
          setShow(true);
        }}
      >
        更新
      </button>
      <button
        className="btn btn-sm ml-2"
        onClick={() => handleDeleteRSS(rss.id)}
      >
        删除
      </button>
    </li>
  );
}

type RSSFormProp = {
  id: number;
  hideModal: () => void;
};

function RSSForm({ id, hideModal }: RSSFormProp) {
  let [rss, setRSS] = useState<RSSField>({
    id: 0,
    name: "",
    url: "",
  });

  const handleChange = (e: any) => {
    setRSS({
      ...rss,
      [e.target.name]: e.target.value,
    });
  };

  const addRSS = async () => {
    await AddRSS(rss);

    hideModal();
  };

  const getRSS = async (id: number) => {
    const data: RSSField = await GetRSS(id);

    setRSS(data);
  };

  const updateRSS = async () => {
    await UpdateRSS(rss);

    hideModal();
  };

  const handleClick = () => {
    if (id == 0) {
      addRSS();
    } else {
      updateRSS();
    }
  };

  useEffect(
    function () {
      if (id == 0) {
        return;
      }

      getRSS(id);
    },
    [id]
  );

  return (
    <dialog id="rss_modal" className="modal modal-open">
      <div className="modal-box w-fit">
        <form>
          <div>
            <label htmlFor="name">RSS源名称:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="请输入RSS源名称"
              className="border m-2"
              value={rss.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="url">RSS源地址:</label>
            <input
              type="text"
              id="url"
              name="url"
              placeholder="请输入RSS源地址"
              className="border m-2"
              value={rss.url}
              onChange={handleChange}
            />
          </div>
          <div className="text-right">
            <button
              type="button"
              className="btn btn-sm mt-2"
              onClick={handleClick}
            >
              确定
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default RSSApp;
