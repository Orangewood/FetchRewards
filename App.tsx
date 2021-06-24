import { useState, useEffect } from "react";
import { Col, Row, Space, Divider } from "antd";
import "antd/dist/antd.css";

interface responseList {
  id: number;
  listId: number;
  name: string | null;
}

function api<T>(url: string): Promise<T> {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}

export default function App() {
  const [data, setData] = useState<responseList[]>([]);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    api<responseList[]>("https://fetch-hiring.s3.amazonaws.com/hiring.json")
      .then((res: responseList[]) => {
        let filteredReponse = res.filter(
          (a) => a.name !== "" && a.name !== null
        );
        setData(filteredReponse);
      })
      .catch(() => setError(true));
  }, []);

  const sortData = (array: responseList[]): responseList[] => {
    return array.sort((a, b) => a.id! - b.id!);
  };

  const uniqueId = [
    ...new Set(data.map((a) => a.listId).sort((a, b) => a - b)),
  ];

  return (
    <>
      {error && <div>Api error!</div>} {/* insert custom error here*/}
      <Row gutter={24}>
        {uniqueId.map((currentNumber, index) => {
          return (
            <Col span={6} key={index}>
              <Row
                style={{ justifyContent: "center" }}
              >{`List ID:  ${currentNumber}`}</Row>
              <Divider></Divider>
              {sortData(data.filter((b) => b.listId === currentNumber)).map(
                (c, index) => {
                  return (
                    <Row key={index} style={{ justifyContent: "center" }}>
                      <Space>
                        <Col>{`List Id: ${c.listId}`}</Col>
                        <Col>{`Name: ${c.name}`}</Col>
                        <Col>{`Id: ${c.id}`}</Col>
                      </Space>
                    </Row>
                  );
                }
              )}
            </Col>
          );
        })}
      </Row>
    </>
  );
}
