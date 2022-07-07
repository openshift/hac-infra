#!/bin/bash
mkdir -p "$WORKSPACE/artifacts"
cat << EOF > "$WORKSPACE/artifacts/junit-dummy.xml"
<testsuite tests="1">
    <testcase classname="dummy" name="dummytest"/>
</testsuite>
EOF