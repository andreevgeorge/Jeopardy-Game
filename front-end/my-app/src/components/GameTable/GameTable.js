import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./game.module.css";

import { useSelector, useDispatch } from "react-redux";
import {
  createQuestionsARrAC,
  answeredQuestionAC,
  changePointsAC,
  changeIdAC,
} from "../../store/game/actions";
import { Modal, ModalBody, Button, Input, Form } from "reactstrap";

function GameTable(props) {
  const params = useParams();
  const dispatch = useDispatch();

  const [topics, setTopic] = useState([]);
  const [currentQuestion, setcurrentQuestion] = useState({}); // для заполнения модального окна вопросом
  const [modal, showModal] = useState(false); // показ окна
  //const [points, setPoints] = useState(0);
  const points = useSelector((store) => store.game.points);
  const gameId = useSelector((store) => store.game.gameId);
  const user = useSelector((store) => store.auth.user);

  useEffect(() => {
    (async () => {
      if (params.id === "resume") {
        console.log(points);
        console.log("resume");
        const response = await fetch("/topics");
        let topicsInfo = await response.json();
        setTopic(topicsInfo);
      } else if (params.id === "new") {
        if (gameId !== 0) {
          await fetch("/gameData", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              gameId,
              points,
            }),
          });
        }
        console.log(user.id);
        let res = await fetch("/gameId", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        });
        const idGame = await res.json();
        dispatch(changeIdAC(idGame));

        dispatch(changePointsAC(0));
        console.log("new");
        const response = await fetch("/topics");
        let topicsInfo = await response.json();
        setTopic(topicsInfo);
        //
        const response2 = await fetch("/questions");
        let questionsInfo = await response2.json();
        // достаем все темы
        // добавляем туда поле вопрос что вопрос отвечен
        // посылаем в редакс
        dispatch(createQuestionsARrAC(questionsInfo));
      }
    })();
  }, [params.id]);
  const arr = useSelector((store) => store.game.questions);

  function showQuestion(id) {
    let res = arr.filter((el) => el.id === id);
    setcurrentQuestion(res[0]);
    showModal(true);
  }

  //
  const onSubmitHandler = (e) => {
    e.preventDefault(e);

    console.log(e.target[0].value);
    console.log(currentQuestion);
    if (
      e.target[0].value.toLowerCase() === currentQuestion.answer.toLowerCase()
    ) {
      let score = points + currentQuestion.points;
      dispatch(changePointsAC(score));
    } else {
      let score = points - currentQuestion.points;
      dispatch(changePointsAC(score));
    }

    dispatch(answeredQuestionAC(currentQuestion.id));
    showModal(false);
  };
  console.log(points);

  return (
    <>
      <div className={styles.points}>Your points: {points}</div>
      <table className={styles.table}>
        {topics.map((elem) => {
          return (
            <>
              <tr>
                <td className={styles.cell}>{elem.name}</td>
                {arr.map((el) => {
                  if (el.topic_id === Number(elem.id)) {
                    return (
                      <>
                        <td
                          className={
                            el.completed
                              ? (styles.cell, styles.completed)
                              : styles.cell
                          }
                          onClick={() => showQuestion(el.id)}
                        >
                          {el.points}
                        </td>
                      </>
                    );
                  }
                })}
              </tr>
            </>
          );
        })}

        <Modal
          isOpen={modal}
          className={styles.modal}
          toggle={function noRefCheck() {}}
        >
          <ModalBody>
            {currentQuestion.question}
            <Form
              onSubmit={(e) => {
                onSubmitHandler(e);
              }}
            >
              <Input name="answer" className={styles.input} />
              <Button type="submit" color="primary">
                Отправить
              </Button>
            </Form>
          </ModalBody>
        </Modal>
      </table>
    </>
  );
}

export default GameTable;
