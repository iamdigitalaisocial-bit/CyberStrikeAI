//go:build windows

package security

import (
	"os/exec"
	"strconv"
	"syscall"
)

func prepareShellCmdSession(cmd *exec.Cmd) error {
	if cmd == nil {
		return nil
	}
	// 独立进程组，便于 taskkill /T 终止整棵子进程树。
	if cmd.SysProcAttr == nil {
		cmd.SysProcAttr = &syscall.SysProcAttr{}
	}
	cmd.SysProcAttr.CreationFlags = syscall.CREATE_NEW_PROCESS_GROUP
	return nil
}

// terminateCmdTree 使用 taskkill /F /T 终止进程及其子进程（Windows 上 Process.Kill 无法保证杀掉 python 等孙进程）。
func terminateCmdTree(cmd *exec.Cmd) {
	if cmd == nil || cmd.Process == nil {
		return
	}
	pid := cmd.Process.Pid
	tk := exec.Command("taskkill", "/F", "/T", "/PID", strconv.Itoa(pid))
	if err := tk.Run(); err != nil {
		_ = cmd.Process.Kill()
	}
}
