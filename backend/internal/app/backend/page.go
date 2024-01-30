package backend

type Page struct {
	No   int `form:"page_no,default=1"`
	Size int `form:"page_size,default=10"`
}

func (p *Page) Offset() int {
	return (p.No - 1) * p.Size
}

func (p *Page) Limit() int {
	return p.Size
}
