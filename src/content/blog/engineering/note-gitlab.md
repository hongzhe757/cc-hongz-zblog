---
title: 'GitLab命令行基本命令'
description: '该文件主要来自文思总结'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-2.jpg'
tags: ["笔记", "技术总结", "git"]
category: 'engineering'
---

该文件主要来自文思总结

```git

1.  `打包 mvn clean package -Dmaven.test.skip=true`
2.  `操作`

4.  `Pactera@DESKTOP-3ER5AEF MINGW64 /e/project/TLS (develop)`
5.  `$ git push origin HEAD:refs/for/develop`
6.  `Enumerating objects: 61, done.`
7.  `Counting objects: 100% (61/61), done.`
8.  `Delta compression using up to 4 threads`
9.  `Compressing objects: 100% (31/31), done.`
10.  `Writing objects: 100% (38/38), 83.31 KiB | 3.47 MiB/s, done.`
11.  `Total 38 (delta 14), reused 0 (delta 0)`
12.  `remote: Resolving deltas: 100% (14/14)`
13.  `remote: Processing changes: refs: 1, done`
14.  `remote: ERROR: [d2250d6] missing Change-Id in commit message footer`
15.  `remote:`
16.  `remote: Hint: To automatically insert Change-Id, install the hook:`
17.  `remote: gitdir=$(git rev-parse --git-dir); scp -p -P 29418 chenxi@172.17.5.231`
18.  `remote: And then amend the commit:`
19.  `remote: git commit --amend`
20.  `remote:`
21.  `To ssh://172.17.5.231:29418/tls`
22.   `! [remote rejected] HEAD -> refs/for/develop ([d2250d6] missing Change-Id in co`
23.  `error: failed to push some refs to 'ssh://chenxi@172.17.5.231:29418/tls'`

25.  `Pactera@DESKTOP-3ER5AEF MINGW64 /e/project/TLS (develop)`
26.  `$ cd .git/`
27.  `l`
28.  `Pactera@DESKTOP-3ER5AEF MINGW64 /e/project/TLS/.git (GIT_DIR!)`
29.  `$ ls`
30.  `COMMIT_EDITMSG config description FETCH_HEAD HEAD hooks/ index info/ log`

32.  `Pactera@DESKTOP-3ER5AEF MINGW64 /e/project/TLS/.git (GIT_DIR!)`
33.  `$ cd ../`

35.  `Pactera@DESKTOP-3ER5AEF MINGW64 /e/project/TLS (develop)`
36.  `$ scp -p -P 29418 qinhongzhe@172.17.5.231:hooks/commit-msg ${gitdir}/hooks/`
37.  `/hooks/: Is a directory`
38.  `protocol error: expected control record`

40.  `Pactera@DESKTOP-3ER5AEF MINGW64 /e/project/TLS (develop)`
41.  `$ scp -p -P 29418 qinhongzhe@172.17.5.231:hooks/commit-msg .git/hooks/commit-msg`

43.  `Pactera@DESKTOP-3ER5AEF MINGW64 /e/project/TLS (develop)`
44.  `$ git log`
45.  `commit d2250d6ab375116d3b3a5aa6733db0096b103e69 (HEAD -> develop)`
46.  `Author: chenxi <xi.chen33@pactera.com>`
47.  `Date: Tue Apr 14 13:49:23 2020 +0800`

49.      `not task : tlsserver Upload branch tools code to server .`

51.  `commit 3a37680b2801937bdc8fc2176e38c16fce5e4676 (origin/develop)`
52.  `Author: lvzhiqiang <zhiqiang.lv@pactera.com>`
53.  `Date: Mon Apr 13 17:07:25 2020 +0800`

55.       `no task : tlsserver Update db file.`

57.      `Change-Id: Ieb21f316070919033d8802d14577e4b6843e2e72`

59.  `commit 3c6b09d0b1cfab573fa4ae4afd281461df8d5e4e`
60.  `Author: lvzhiqiang <zhiqiang.lv@pactera.com>`
61.  `Date: Mon Apr 13 16:55:50 2020 +0800`

63.      `no task : tlsserver Update db file.`

65.      `Change-Id: I33d5809acf0a28c74b5356bf985b424ea40879da`

67.  `commit 215656b46489a57ac8568a1c3bf40bd11a47ab66 (origin/master, origin/HEAD)`
68.  `Author: lvzhiqiang <zhiqiang.lv@pactera.com>`
69.  `Date: Mon Apr 13 15:06:56 2020 +0800`

71.       `no task : tlsserver Initial git warehouse and upload TLS source code.`

73.      `Change-Id: Ida4eb47c7e84a2a1a472c34ff79cf86a3e9b3f2e`

75.  `commit 630521e5b8cac720ac343a22574c7e73ea1f4cd9`
76.  `Author: GerritAdmin231 <k226_gerrit_231@sina.com>`
77.  `Date: Fri Apr 10 11:13:34 2020 +0800`

79.      `Initial empty repository`

81.  `Pactera@DESKTOP-3ER5AEF MINGW64 /e/project/TLS (develop)`
82.  `$`

84.  `Pactera@DESKTOP-3ER5AEF MINGW64 /e/project/TLS (develop)`
85.  `$ git reset --soft 995ede84dfb8f9c1c6819b1baf66ef777928cc22`

87.  `Pactera@DESKTOP-3ER5AEF MINGW64 /e/project/TLS (develop)`
88.  `$ git status`
89.  `On branch develop`
90.  `Your branch is up to date with 'origin/develop'.`

92.  `Changes to be committed:`
93.    `(use "git reset HEAD ..." to unstage)`

95.          `modified: tlsserver/src/main/java/com/pactera/tls/server/controller/In`
96.          `new file: tlsserver/src/main/java/com/pactera/tls/server/controller/tr`
97.          `modified: tlsserver/src/main/java/com/pactera/tls/server/controller/tr`
98.          `new file: tlsserver/src/main/resources/static/css/branchTools/demo-cen`
99.          `new file: tlsserver/src/main/resources/static/css/branchTools/index.cs`
100.          `new file: tlsserver/src/main/resources/static/images/car.png`
101.          `new file: tlsserver/src/main/resources/static/js/branchTools/apiRewrit`
102.          `new file: tlsserver/src/main/resources/static/js/branchTools/benchTest`
103.          `new file: tlsserver/src/main/resources/static/js/branchTools/branchsTo`
104.          `new file: tlsserver/src/main/resources/static/js/branchTools/demoutils`
105.          `new file: tlsserver/src/main/resources/static/js/branchTools/jquery.mi`
106.          `modified: tlsserver/src/main/resources/templates/auth/roleManage.html`
107.          `modified: tlsserver/src/main/resources/templates/fragments/footer.html`
108.          `modified: tlsserver/src/main/resources/templates/home.html`
109.          `new file: tlsserver/src/main/resources/templates/tls/branchTools.html`

111.  `Changes not staged for commit:`
112.    `(use "git add ..." to update what will be committed)`
113.    `(use "git checkout -- ..." to discard changes in working directory)`

115.          `modified: tlsserver/src/main/resources/application-dev.properties`

118.  `Pactera@DESKTOP-3ER5AEF MINGW64 /e/project/TLS (develop)`
119.  `$ git commit -m "not task : tlsserver Upload BaseApi."`
120.  `[develop e8d6f57] not task : tlsserver Upload branch tools code to server.`
121.   `15 files changed, 2421 insertions(+), 117 deletions(-)`
122.   `rewrite tlsserver/src/main/java/com/pactera/tls/server/controller/IndexControll`
123.   `create mode 100644 tlsserver/src/main/java/com/pactera/tls/server/controller/tr`
124.   `create mode 100644 tlsserver/src/main/resources/static/css/branchTools/demo-cen`
125.   `create mode 100644 tlsserver/src/main/resources/static/css/branchTools/index.cs`
126.   `create mode 100644 tlsserver/src/main/resources/static/images/car.png`
127.   `create mode 100644 tlsserver/src/main/resources/static/js/branchTools/apiRewrit`
128.   `create mode 100644 tlsserver/src/main/resources/static/js/branchTools/benchTest`
129.   `create mode 100644 tlsserver/src/main/resources/static/js/branchTools/branchsTo`
130.   `create mode 100644 tlsserver/src/main/resources/static/js/branchTools/demoutils`
131.   `create mode 100644 tlsserver/src/main/resources/static/js/branchTools/jquery.mi`
132.   `create mode 100644 tlsserver/src/main/resources/templates/tls/branchTools.html`

1.  `Pactera@DESKTOP-3ER5AEF MINGW64 /e/project/TLS (develop)`
2.  `$ git push origin HEAD:refs/for/develop`
3.  `Enumerating objects: 61, done.`
4.  `Counting objects: 100% (61/61), done.`
5.  `Delta compression using up to 4 threads`
6.  `Compressing objects: 100% (31/31), done.`
7.  `Writing objects: 100% (38/38), 83.34 KiB | 4.63 MiB/s, done.`
8.  `Total 38 (delta 14), reused 0 (delta 0)`
9.  `remote: Resolving deltas: 100% (14/14)`
10.  `remote: Processing changes: new: 1, refs: 1, done`
11.  `remote:`
12.  `remote: New Changes:`
13.  `remote: http://172.17.5.231:9079/15305 not task : tlsserver Upload branch tool`
14.  `remote:`
15.  `To ssh://172.17.5.231:29418/tls`
16.   `* [new branch] HEAD -> refs/for/develop`
17. 

```
