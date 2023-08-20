# 싸커 퀵 : Soccer quick


<br>

## 프로젝트 주제

- 기획 의도: 다분화된 풋살 매칭 플랫폼에서 주관하는 경기들을 한 곳에 모아 위치, 시간, 가격 등을 비교할 수 있는 플랫폼 구축
- 프로젝트 목표:
  - 사용자 경험 향상을 위해 메인페이지를 단순한 구성
  - 소셜 로그인 기능 및 채팅 기능을 제공
  - 위치 기반 경기장 검색을 지도에 나타냄으로 편리성을 제공
  - 각 플랫폼 및 경기장에 관한 리뷰 기능
  - 크롤링을 통해 수집한 대량의 데이터를 가공하여 사용자에게 양질의 정보 제공

## 데모 사이트

- https://www.soccer-quick.xyz

<br>

## API 명세서

- > [API DOCS](https://soccer-quick-api.notion.site/SoccerQuik-API-Docs-ce1cc9082e714d0ab9d9666316661877)

<br>

## 팀 구성

|  이름  |  포지션   |
| :----: | :-------: |
| 최도원 | Front-End |
| 김승섭 | Front-End |
| 권성경 | Front-End |
| 이민우 | Front-End |
| 안동현 | Back-End  |
| 신성민 | Back-End  |

<br>

### 담당 업무

#### FRONT-END

- 최도원
  - (담당업무를 적어주세요)
- 권성경
  - (담당업무를 적어주세요)
- 김승섭
  - (담당업무를 적어주세요)
- 이민우
  - (담당업무를 적어주세요)

#### BACK-END

- :dog: 안동현

  - 스키마 정의 및 모델링
  - user, adimin, coummunity, team 관련 api 구현
  - 서버 구축 및 데이터베이스 연결(mongoDB)
  - JWT 검증 처리 미들웨어 구현
  - 프로젝트 관련 데이터 크롤링 및 데이터 포맷팅
  - AWS S3 Bucket 클라우드 저장소 연동
  - 탈퇴 회원 일정 주기로 삭제하는 스케줄러 구현

- :rabbit: 신성민
  - 스키마 정의 및 모델링
  - review, dom 관련 api 구현
  - API docs 작성
  - Joi validator 구현

<br>

## 기술 스택

### **FRONT-END**

<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">

#### **Library**

[![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux.js.org/)
[![Redux Persist](https://img.shields.io/badge/Redux_Persist-764ABC?style=for-the-badge)](https://github.com/rt2zz/redux-persist)
[![Redux Thunk](https://img.shields.io/badge/Redux_Thunk-764ABC?style=for-the-badge)](https://github.com/reduxjs/redux-thunk)
[![HTML Parser](https://img.shields.io/badge/HTML_Parser-E34F26?style=for-the-badge)](https://example.com/)
[![React Quill](https://img.shields.io/badge/React_Quill-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://github.com/zenoamaro/react-quill)
[![React Slick](https://img.shields.io/badge/React_Slick-CC6699?style=for-the-badge&logo=react&logoColor=white)](https://example.com/)
[![React Select](https://img.shields.io/badge/React_Select-00B8D9?style=for-the-badge&logo=react&logoColor=white)](https://react-select.com/)
[![React Share](https://img.shields.io/badge/React_Share-4C75A3?style=for-the-badge&logo=react&logoColor=white)](https://example.com/)
[![Styled Components](https://img.shields.io/badge/Styled_Components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)](https://styled-components.com/)

<br><br>

### **BACK-END**

<img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white">
<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node-dot-js&logoColor=white">
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
<img src="https://img.shields.io/badge/AWS_S3-569A31?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS S3">

#### **Library**

<img src="https://img.shields.io/badge/aws--sdk-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="aws-sdk">
<img src="https://img.shields.io/badge/jsonwebtoken-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="jsonwebtoken">
<img src="https://img.shields.io/badge/node--cron-00ACC1?style=for-the-badge&logo=npm&logoColor=white" alt="node-cron">
<img src="https://img.shields.io/badge/bcrypt-BC1C4E?style=for-the-badge&logo=npm&logoColor=white" alt="bcrypt">
<img src="https://img.shields.io/badge/cheerio-e88c1f?style=for-the-badge&logo=javascript&logoColor=white" alt="cheerio">
<img src="https://img.shields.io/badge/joi-F61E2E?style=for-the-badge&logo=npm&logoColor=white" alt="joi">
<img src="https://img.shields.io/badge/mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="mongoose">
<img src="https://img.shields.io/badge/multer-FFD700?style=for-the-badge&logo=npm&logoColor=black" alt="multer">

<br><br>

### Deploy

<img src="https://img.shields.io/badge/GCP_VM-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" alt="GCP VM (pm2)">

<br><br>

### Collaboration Tools

<img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Figma">
<img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord">
<img src="https://img.shields.io/badge/Gather-ff3860?style=for-the-badge&logo=gather&logoColor=white" alt="Gather">
<img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white" alt="Notion">
<img src="https://img.shields.io/badge/GitLab-FCA121?style=for-the-badge&logo=gitlab&logoColor=white" alt="GitLab">
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
<img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white" alt="Postman">

<br><br>

### .env

```
PORT={PORT}
DB_HOST={DB_HOST}
DB_NAME={DB_NAME}
BCRYPT_SALT_ROUNDS={BCRYPT_SALT_ROUNDS}
ACCESS_TOKEN_SECRET={ACCESS_TOKEN_SECRET}
REFRESH_TOKEN_SECRET={REFRESH_TOKEN_SECRET}
REFRESH_TOKEN_EXPIRES_IN={REFRESH_TOKEN_EXPIRES_IN}
ACCESS_TOKEN_EXPIRES_IN={ACCESS_TOKEN_EXPIRES_IN}
AWS_ACCESS_KEY={AWS_ACCESS_KEY}
AWS_ACCESS_SECRET_KEY={AWS_ACCESS_SECRET_KEY}
REGION={REGION}
S3_BUCKET={S3_BUCKET}
```

<br><br>

## Git Branch 관리

### FrontEnd branch

```
master
├── dev
│   ├── feature
│   │   ├── feature_dw
│   │   ├── feature_ss
│   │   ├── feature_sk
│___│___└── feature_mw
```

### BackEnd branch

```
master
├── dev
│   ├── user1
│___│__ user2
```

---

## 팀 컨벤션

### [Commit 컨벤션](https://velog.io/@shin6403/Git-git-%EC%BB%A4%EB%B0%8B-%EC%BB%A8%EB%B2%A4%EC%85%98-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0)

`태그 : 제목`의 형태이며, `:뒤에만 space`가 있음에 유의

- feat : 새로운 기능 추가
- fix : 버그 수정
- docs : 문서(README.md) 수정
- style : 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
- refactor : 코드 리펙토링
- delete : 기능/코드 삭제
- test : 테스트 코드, 리펙토링 테스트 코드 추가
- chore : 빌드 업무 수정, 패키지 매니저 수정

### 코드 컨벤션

- 파일명, export 함수명: PascalCase
- 주석:
  - 함수의 기능과 특징 설명 / 함수 위
  - 함수 내 코드 설명 / 코드 오른쪽

<br><br>

##### Copyright

Copyright © soccerQuick All Rights Reserved

---

본 프로젝트에서 제공하는 모든 코드 등의는 저작권법에 의해 보호받는 ㈜엘리스의 자산이며, 무단 사용 및 도용, 복제 및 배포를 금합니다.
Copyright 2023 엘리스 Inc. All rights reserved.
