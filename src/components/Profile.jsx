import React from 'react';
import styled from 'styled-components';

// Styled Components
const PageContainer = styled.div`
  font-family: sans-serif;
  background-color: #f0f0f0;
  padding: 20px;
`;

const Header = styled.div`
  background-color: #808080;
  color: white;
  padding: 10px;
  display: flex;
  justify-content: space-around;
`;

const HeaderLink = styled.a`
  color: white;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 5px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const AllocationBox = styled.div`
  background-color: #a9a9a9;
  color: black;
  padding: 20px;
  border-radius: 10px;
  width: 30%;
`;

const InfoBox = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  width: 30%;
`;

function App() {
  return (
    <PageContainer>
      <Header>
        <HeaderLink href="#">HOME</HeaderLink>
        <HeaderLink href="#">LAB LAYOUT</HeaderLink>
        <HeaderLink href="#">SERVER MONITORING</HeaderLink>
        <HeaderLink href="#">PROFILE</HeaderLink>
        <HeaderLink href="#">Logout</HeaderLink>
      </Header>

      <Title>Student's Profile</Title>

      <ContentContainer>
        <AllocationBox>
          <h3>Current Allocation:</h3>
          <p>Lab: BDL</p>
          <p>Seat No.: B1</p>
          <p>Type: Desktop-based</p>
          <h3>Past Allocations:</h3>
          <p>...</p>
          <p>...</p>
          <p>...</p>
          <p>...</p>
          <p>...</p>
        </AllocationBox>

        <InfoBox>
          <p>Name: Student</p>
          <p>Email: YYY</p>
          <p>Roll Number: YYY</p>
        </InfoBox>
      </ContentContainer>
    </PageContainer>
  );
}

export default App;
