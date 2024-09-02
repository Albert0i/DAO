### Reflux 

```
CREATE TABLE albertoi/employee (
    id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(40),
    birthday decimal(8, 0) default 0,
    gender CHAR(1) default 'M', 
    createdAt TIMESTAMP default current timestamp
)

CREATE TABLE albertoi/reflux (
    id INT GENERATED ALWAYS AS IDENTITY,
    content VARCHAR(1024),
    completed CHAR(5) default 'false', 
    updatedAt TIMESTAMP, 
    createdAt TIMESTAMP default current timestamp
)
```

```
STRJRNPF FILE(ALBERTOI/REFLUX) JRN(ALBERTOI/MYJRN) IMAGES(*BOTH) OMTJRNE(*OPNCLO)
STRJRNPF FILE(ALBERTOI/EMPLOYEE) JRN(ALBERTOI/MYJRN) IMAGES(*BOTH) OMTJRNE(*OPNCLO)
```

```
insert into albertoi/employee (name, birthday, gender) values('alberto', 19661223, 'M')
```

```
select * from albertoi.reflux@as400.ih; 

insert into albertoi.reflux@as400.ih (content) values('insert into albertoi.employee(name, birthday, gender) values(''alberto'', 19661223, ''M'') ');
insert into albertoi.reflux@as400.ih (content) values('insert into albertoi.employee(name, birthday, gender) values(''bertinho'', 20240902, ''M'') ');

insert into albertoi.reflux@as400.ih (content) values('insert into albertoi.employee(name, birthday, gender) values(''小志強'', 20240902, ''M'') ');
insert into albertoi.reflux@as400.ih (content) values('update albertoi.employee set name=albertoi.ucs2tobig5(''小志強'') where id=7 ');
```

```
CREATE TRIGGER albertoi/reflux_processor
AFTER INSERT ON reflux
REFERENCING NEW AS new_row
FOR EACH ROW
BEGIN
    DECLARE SQLCODE INTEGER;
    DECLARE SQLSTATE CHAR(5);

    EXECUTE IMMEDIATE new_row.content; 
    UPDATE reflux set updatedAt = current timestamp, 
           completed = 'true' 
    WHERE id = new_row.id;
END
```

```
create function albertoi.ucs2tobig5(ucs2string graphic(40) CCSID 1200)
returns char(80) CCSID 1377
LANGUAGE SQL
CONTAINS SQL
EXTERNAL ACTION
DETERMINISTIC
return cast(ucs2string as char(80) ccsid 1377);
```

### EOF (2024/09/06)