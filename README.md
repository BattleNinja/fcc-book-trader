passport:

passport.use(new LocalStrategy(
  function(username, password, done) {
只能是 username 其他的 参数 传不进去， 把 form的 输入 也改为 username。 传入的email 名字 是 username 但是 在 数据库 查询的 时候 可以 用 email:username
