package backend

import (
	"path"
	"time"

	"github.com/google/uuid"
)

func getMinioObjectName(file string) string {
	dir := path.Join(time.Now().Format("2006/01/02/"), uuid.NewString())
	return path.Join(dir, file)
}
