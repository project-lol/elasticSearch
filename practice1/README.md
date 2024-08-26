> 참고자료 : https://medium.com/@upadhyayyuvi/building-a-search-engine-using-node-js-and-elasticsearch-48b5086cf8ea

## 인덱스 :

- 인덱스는 엘라스틱 서치에서 데이터를 저장하고 검색하기 위해서 사용하는 기본 단위이다.
- 이 인덱스가 데이터베이스에서는 '테이블'과 같은 개념이다.

### 인덱스 생성하는 방법

```
curl -X PUT "localhost:9200/books"
```

- 위 명령어는 books라는 인덱스를 생성하는 명령어이다.
- 엘라스틱 서치에 PUT 요청을 보내서 books라는 이름의 새로운 인덱스를 생성한다.

### 데이터 입력하기

```
curl -H "Content-Type: application/json" -XPOST "http://localhost:9200/books/_bulk?pretty" --data-binary "@data.json"
```

- 위 명령어를 통해 데이터를 입력할 수 있다.
- \_bulk는 엘라스틱서치에서 여러 데이터를 인덱스에 한번에 넣기 위한 api 엔드포인트이다.
- pretty 는 응답 데이터를 사람이 읽기 좋게 포매팅을 하는 옵션이다. 이 옵션이 없으면 한 줄로 응답이 돌아온다.

### [엘라스틱 서치에 검색요청하는 api만들기](./app.js)

```js
...
client.search({
  index: "books",
  body: {
    query: {
      multi_match: {
        query: searchQuery,
        fields: ["title^3", "author^2"],
      },
    },
  },
});
...
```

- 이러한 형식으로 검색을 요청할 수 있다.
- 검색을 위한 구문에는 다양한 방법들이 존재한다.
- client.search 메서드는 특정 인덱스에 대해서 검색 쿼리를 수행하는 함수이다. 현재는 books라는 인덱스에 대해서 검색을 수행하고 있다.
- multi_match 는 여러 필드에 대해서 하나의 쿼리를 실행한다. 해당필드들이 지정된 방식에 따라 얼마나 매칭되는지를 평가한다.
- 이 쿼리를 통해서 사용자가 입력한 검색어를 여러 필드에서(title, author) 검색을 수행한다.
- fields: ["title^3", "author^2"]: 검색 대상이 되는 필드 목록이다.
  title^3와 author^2처럼 각 필드에는 가중치(weight)를 부여할 수 있다.
  ^3은 title 필드에 더 높은 중요도를 부여하고, ^2는 author 필드에 상대적으로 낮은 중요도를 부여한다.
  즉, title 필드에서의 매칭이 더 중요하게 평가되며, 검색어가 title 필드에서 매칭될 경우 더 높은 점수를 받습니다.
