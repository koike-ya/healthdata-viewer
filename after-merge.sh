CUR_BRANCH=`git symbolic-ref --short HEAD`

git checkout $1
git pull origin $1
git branch -d $CUR_BRANCH
git checkout -b $2
