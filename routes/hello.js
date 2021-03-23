const router = require('express').Router();
// 这里需要特别注意的是：注意缩减和层次。否则构建出来会有问题。
/**
 * @swagger
 * /hello:
 *   get:
 *     tags:
 *       - swagger测试
 *     summary: GET测试
 *     description: 用于测试基础GET请求的接口
 *     parameters:
 *       - name: name
 *         description: 用户名字
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: 成功返回 world
 */
router.get("/", (req, res) => {
  console.log(req.query);
  let name = req.query.name;
  res.send(`hello ${name}!!!`);
});
module.exports = router;