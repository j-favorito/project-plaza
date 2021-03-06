import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Container } from "react-bootstrap";
import { CustomJumbotron } from "./utils/elements";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../../../Loading/Loading";
import Card from "./components/Card/Card";
import { cards } from "./utils/cards";

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  const [totalIssues, setTotalIssues] = useState(null);
  const [completedIssues, setCompletedIssues] = useState(null);
  const [totalProjects, setTotalProjects] = useState(null);

  const { profile, work, history } = cards;

  let start = async () => {
    await axios.post("/cookie", user);
    await fetchUserData();
  };

  const getTotalIssues = (user) => {
    if (isAuthenticated) {
      let total = 0;

      user.projects.forEach((project) => {
        total += project.issues.length;
      });

      setTotalIssues(total);
    }
  };

  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(`/api/user`);
      getTotalIssues(data[0]);
      getTotalCompletedIssues(data[0]);
      setTotalProjects(data[0].projects.length);
    } catch (error) {
      console.error(error);
    }
  };

  const getTotalCompletedIssues = (user) => {
    if (user !== null) {
      const completed = [];
      user.projects.forEach((proj) =>
        proj.issues.forEach((issue) => {
          if (issue.completed === true) {
            completed.push(issue);
          }
        })
      );
      setCompletedIssues(completed.length);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      start();
    }

    // eslint-disable-next-line
  }, [isAuthenticated]);

  return (
    <>

    
          <CustomJumbotron>
            <Container>
              <Row>
                <Col>
                  <h1 className="header">Welcome back!</h1>
                  <h1 className="header">
                    {isAuthenticated ? user.name : "Guest"}
                  </h1>
                </Col>
                <Col>
                  <Card
                    text={profile}
                    fieldOne={user.name}
                    fieldTwo={user.email}
                  />
                </Col>
              </Row>
            </Container>
          </CustomJumbotron>
          <Container>
            <Row className="py-5">
              <Col md={6} className="py-5 py-md-0">
                <Card
                  text={work}
                  fieldOne={totalProjects}
                  fieldTwo={totalIssues}
                />
              </Col>
              <Col md={6} className="py-5 py-md-0">
                <Card text={history} fieldOne={completedIssues} />
              </Col>
            </Row>
            <br></br>
          </Container>
        </>
  );
};

export default withAuthenticationRequired(Profile, {
  onRedirecting: () => <Loading />,
  returnTo: "/",
});
