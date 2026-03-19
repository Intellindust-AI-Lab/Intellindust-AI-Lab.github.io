# 中国科学技术大学（USTC）Anaconda 镜像配置

## 推荐镜像源配置

### 方法1: 使用 conda 配置命令（推荐）

```bash
# 添加 USTC 镜像源
conda config --add channels https://mirrors.ustc.edu.cn/anaconda/pkgs/free
conda config --add channels https://mirrors.ustc.edu.cn/anaconda/pkgs/main
conda config --add channels https://mirrors.ustc.edu.cn/anaconda/cloud/pytorch

# 设置搜索时显示通道地址
conda config --set show_channel_urls yes

# 验证配置
conda config --show channels
```

### 方法2: 手动编辑配置文件

配置文件位置：
- **Windows**: `C:\Users\YourUsername\.condarc`
- **Linux/Mac**: `~/.condarc`

添加以下内容：

```yaml
channels:
  - https://mirrors.ustc.edu.cn/anaconda/cloud/pytorch
  - https://mirrors.ustc.edu.cn/anaconda/pkgs/main
  - https://mirrors.ustc.edu.cn/anaconda/pkgs/free
  - defaults
show_channel_urls: true
ssl_verify: true
```

### 方法3: 临时使用（不修改配置）

```bash
# 在命令后添加 -c 参数指定镜像源
conda install package_name -c https://mirrors.ustc.edu.cn/anaconda/pkgs/main
```

## 镜像地址列表

| 镜像类型 | 地址 |
|---------|------|
| **主频道（pytorch）** | `https://mirrors.ustc.edu.cn/anaconda/cloud/pytorch` |
| **主频道（main）** | `https://mirrors.ustc.edu.cn/anaconda/pkgs/main` |
| **免费频道（free）** | `https://mirrors.ustc.edu.cn/anaconda/pkgs/free` |

## 常用命令

### 查看当前配置
```bash
conda config --show
```

### 删除镜像源
```bash
conda config --remove channels https://mirrors.ustc.edu.cn/anaconda/pkgs/free
```

### 恢复默认源
```bash
conda config --remove-key channels
```

### 更新 conda
```bash
conda update conda
```

### 清理缓存
```bash
conda clean -i  # 清理索引缓存
conda clean -a  # 清理所有缓存
```

## PyTorch 专用镜像配置

如果只需要 PyTorch 相关的包：

```bash
# 添加 PyTorch 镜像
conda config --add channels https://mirrors.ustc.edu.cn/anaconda/cloud/pytorch

# 安装 PyTorch（示例）
conda install pytorch torchvision torchaudio cpuonly -c pytorch
```

## 注意事项

1. ⚠️ **SSL验证**: 如果遇到SSL证书问题，可以暂时设置 `ssl_verify: false`（不推荐）
2. ⚠️ **兼容性**: 某些旧版本conda可能不支持自定义镜像源URL
3. ✅ **推荐**: 使用最新版本的conda或Anaconda以获得最佳兼容性
4. 🔄 **更新**: 建议定期更新镜像源索引：`conda update --all`

## 其他 USTC 镜像源

### conda-forge (社区维护的包)
```bash
conda config --add channels https://mirrors.ustc.edu.cn/anaconda/cloud/conda-forge
```

### PyPI 镜像（pip使用）
```bash
pip config set global.index-url https://pypi.mirrors.ustc.edu.cn/simple
```

### 临时使用 pip USTC 镜像
```bash
pip install package_name -i https://pypi.mirrors.ustc.edu.cn/simple
```

## 常见镜像源对比

### 国内主流 Anaconda 镜像

| 镜像提供商 | 主页 | 特点 |
|-----------|------|------|
| **中科大（USTC）** | https://mirrors.ustc.edu.cn | 教育网优化，稳定快速 |
| **清华大学** | https://mirrors.tuna.tsinghua.edu.cn | 覆盖面广，更新及时 |
| **阿里云** | https://mirrors.aliyun.com | 商业级稳定 |
| **华为云** | https://mirrors.huaweicloud.com | 企业级服务 |

### 各镜像源完整地址

**USTC：**
- Anaconda: `https://mirrors.ustc.edu.cn/anaconda`
- PyPI: `https://pypi.mirrors.ustc.edu.cn/simple`

**清华：**
- Anaconda: `https://mirrors.tuna.tsinghua.edu.cn/anaconda`
- PyPI: `https://pypi.tuna.tsinghua.edu.cn/simple`

