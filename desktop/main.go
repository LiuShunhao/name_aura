// 青囊起名的 Windows 启动器。把 Next 静态导出嵌进一个可执行文件，
// 在本机打开页面，不需要单独安装 Node。
package main

import (
	"embed"
	"io/fs"
	"net"
	"net/http"
	"os/exec"
	"runtime"
)

//go:embed all:out
var assets embed.FS

const addr = "127.0.0.1:38471"

func main() {
	root, err := fs.Sub(assets, "out")
	if err != nil {
		return
	}

	listener, err := net.Listen("tcp", addr)
	if err != nil {
		openBrowser("http://" + addr + "/")
		return
	}

	go func() {
		_ = http.Serve(listener, http.FileServer(http.FS(root)))
	}()
	openBrowser("http://" + addr + "/")
	select {}
}

func openBrowser(url string) {
	switch runtime.GOOS {
	case "windows":
		_ = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		_ = exec.Command("open", url).Start()
	default:
		_ = exec.Command("xdg-open", url).Start()
	}
}
