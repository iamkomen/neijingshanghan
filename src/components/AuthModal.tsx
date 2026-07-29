/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, User, Key, CheckCircle, ShieldCheck, LogIn, UserPlus, X } from 'lucide-react';

export interface UserAccount {
  username: string;
  passwordHash: string; // Plain password or simple string stored locally
  isLoggedIn: boolean;
  hasPasswordSet: boolean;
}

interface AuthModalProps {
  account: UserAccount;
  onLoginSuccess: (username: string) => void;
  onSetPassword: (username: string, password: string) => void;
  onClose: () => void;
}

export default function AuthModal({
  account,
  onLoginSuccess,
  onSetPassword,
  onClose
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(account.hasPasswordSet ? 'login' : 'register');
  const [usernameInput, setUsernameInput] = useState(account.username || '岐黄弟子');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'login') {
      if (account.hasPasswordSet) {
        if (passwordInput === account.passwordHash && usernameInput === account.username) {
          setSuccessMsg("登录成功！");
          setTimeout(() => {
            onLoginSuccess(usernameInput);
            onClose();
          }, 600);
        } else {
          setErrorMsg("用户名或密码不正确，请重新输入。");
        }
      } else {
        // No password set yet, direct login
        onLoginSuccess(usernameInput);
        onClose();
      }
    } else {
      // Register or set password
      if (!usernameInput.trim()) {
        setErrorMsg("请输入用户名。");
        return;
      }
      if (!passwordInput) {
        setErrorMsg("请输入密码。");
        return;
      }
      if (passwordInput !== confirmPassword) {
        setErrorMsg("两次输入的密码不一致，请检查。");
        return;
      }

      onSetPassword(usernameInput.trim(), passwordInput);
      setSuccessMsg("密码设置成功，已为您绑定学习账号！");
      setTimeout(() => {
        onClose();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl space-y-6 relative animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {mode === 'login' ? '弟子账号登录' : '设置弟子用户名与密码'}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {mode === 'login'
              ? '输入用户名与密码，解锁您的伤寒学习进度与修行日记。'
              : '设置本地账号与密码，保护您的个人研习日记与关卡数据。'}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            账号登录
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            {account.hasPasswordSet ? '修改密码/账号' : '绑定密码'}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              {successMsg}
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">用户名</label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="例如：岐黄弟子、张仲景研习者..."
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">密码</label>
            <div className="relative">
              <Key className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="设置或输入您的登录密码..."
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                required={mode === 'register' || account.hasPasswordSet}
              />
            </div>
          </div>

          {/* Confirm Password if Register */}
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">确认密码</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入相同密码..."
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  required
                />
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer mt-2"
          >
            {mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>立即验证登录</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>保存账号与密码</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
