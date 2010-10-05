SRC_DIR = src
BUILD_DIR = build

JS_FILES = ${SRC_DIR}/jfeed.js\
 ${SRC_DIR}/jfeeditem.js\
 ${SRC_DIR}/jatom.js\
 ${SRC_DIR}/jrss.js

WE = ${BUILD_DIR}/dist/jquery.jfeed.js
WE_PACK = ${BUILD_DIR}/dist/jquery.jfeed.pack.js
WE_ARCH = ../jquery.jfeed.tar.gz

MERGE = sed -s -e '1 s/^\xEF\xBB\xBF//' ${JS_FILES} > ${WE}
PACKER = perl -I${BUILD_DIR}/packer ${BUILD_DIR}/packer/jsPacker.pl -i ${WE} -o ${WE_PACK} -e62

all: archive

jfeed:
	@@echo "Building" ${WE}

	@@echo " - Merging files"
	@@${MERGE}

	@@echo ${WE} "Built"
	@@echo

pack: jfeed
	@@echo "Building" ${WE_PACK}

	@@echo " - Compressing using Packer"
	@@${PACKER}

	@@echo ${WE_PACK} "Built"
	@@echo

archive: pack
	@@echo "Building" ${WE_ARCH}

	@@echo " - Creating archive"
	@@tar -C .. -czf ${WE_ARCH} --exclude '.svn' jfeed
