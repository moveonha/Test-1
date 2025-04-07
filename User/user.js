const express = require('express');
const router  = express.Router();
const fs      = require('fs');

// 00. User ID를 기준으로 정보를 읽는 함수
router.get('/:userId',(req,res)=>{
    /* 
        * TODO list 1
        userID로 File에서 검색해서 정보를 클라이언트로 return

        userData에 파일에서 읽어온 데이터를 저장 해야 합니다.
        userData를 Json형식으로 return 하세요.

    */

    const userID = req.params.userId;
    console.log(`userID : ${userID}`);

    return res.status(200).json(
        {
            "message" :"ok"
        }
    )
    //TODO
    //const userIdData    = userData;
    //return userIdData;

});

// 01. User ID를 기준으로 클라이언트로부터 전달받은 userData를 수정하는 함수
router.patch('/:userId', (req, res) =>{
    /*
        * TODO list 2
        userID로 File에서 검색 후 검색한 데이터를 전달받은 데이터로 수정해야합니다.
        수정 된 userData를 client로 return 하세요.
        
        만약 파일에서 수정할 수 있는 user 정보를 찾지 못한다면, 클라이언트에게 찾지 못한다고 return 하세요.
    */
    const userID        = req.params.userId;
    console.log(`userID : ${userID}`);

    const patchUserData = req.body;
    console.log(`patchUserData : ${patchUserData}`);
    return res.status(200).json(
        {
            "message" :"ok"
        }
    )
    //TODO
    //const userIdData    = userData;
    //return userIdData;
});

router.post('/', (req, res) =>{
    /*
        TODO list 3
        client로 전달받은 user data를 파일에 저장하세요.
        중복검사를 하세요.
        중복된 데이터는 처리할 수 없음을 클라이언트로 알리세요.
    */
    const userData = req.body;
    console.log(`userData : ${userData}`);
    return res.status(200).json(
        {
            "message" :"ok"
        }
    )
});

module.exports = router;