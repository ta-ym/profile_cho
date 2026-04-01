# 🎯 プロフィール帳アプリ

人メモアプリ - プロフィール交換・管理アプリケーション

## 📱 概要

**プロフィール帳** は、複数の人間関係を効率的に管理できるモバイルアプリです。以下の機能を提供します：

- 📝 プロフィール管理（名前、メール、電話等）
- 👥 人間カテゴリテンプレート（職場、学校、友人等）
- 📲 QRコードによる安全なプロフ交換
- 🎨 カスタマイズ可能なUIテーマ
- 🔐 起動パスワード保護
- ☁️ クラウド同期対応（AWS）
- 🔗 SNS連携（LINE, Twitter, Instagram等）

## 🛠️ 技術スタック

| 層 | 技術 |
|----|------|
| **フロントエンド** | React Native 0.81+ + TypeScript |
| **状態管理** | Zustand |
| **ローカルDB** | SQLite (expo-sqlite) |
| **クラウドバックエンド** | AWS (Amplify + AppSync + DynamoDB + S3) |
| **認証** | カスタムパスワード + AWS Cognito（将来用） |
| **QR・カメラ** | react-native-qrcode-svg, expo-camera |
| **ビルドツール** | Expo Managed Workflow |

## 🚀 クイックスタート

### 前提条件
- Node.js 18.19.1+
- npm 9.2.0+

### セットアップ
```bash
# リポジトリクローン
git clone <repository-url>
cd profile-app

# 依存パッケージインストール（済み）
npm install

# ローカル開発サーバー起動
npm start
```

### 利用可能なコマンド
```bash
# 開発
npm start           # Expo 開発サーバー起動
npm run android     # Android エミュレータで実行
npm run ios         # iOS シミュレータで実行（macOS のみ）
npm run web         # ウェブブラウザで実行

# コード品質
npm run lint        # ESLint 実行
npm run lint:fix    # ESLint 自動修正
npm run format      # Prettier フォーマット
npm run format:check # Prettier チェック
npm run type-check  # TypeScript 型チェック
```

## 📁 プロジェクト構成

```
profile-app/
├── src/
│   ├── screens/         # 画面コンポーネント
│   ├── components/      # 再利用可能なコンポーネント
│   ├── store/          # Zustand ストア
│   ├── services/       # ビジネスロジック
│   │   ├── database/   # SQLite 処理
│   │   ├── aws/        # AWS 連携
│   │   ├── qr/         # QR 機能
│   │   └── ...
│   ├── types/          # TypeScript 型定義
│   ├── utils/          # ユーティリティ関数
│   ├── styles/         # スタイル・テーマ
│   ├── hooks/          # カスタムフック
│   ├── navigation/     # ナビゲーション設定
│   └── App.tsx         # エントリーポイント
├── __tests__/          # テストファイル
├── app.json            # Expo 設定
├── package.json        # 依存パッケージ
└── tsconfig.json       # TypeScript 設定
```

## 📖 開発ロードマップ

詳細な開発計画は `/memories/session/DEVELOPMENT_ROADMAP.md` を参照してください。

| フェーズ | 内容 | 状態 |
|---------|------|------|
| 0 | 要件定義・技術選定 | ✅ 完了 |
| 1 | プロジェクト立ち上げ | 🔨 進行中 |
| 2-9 | その他フェーズ | ⏳ 予定 |

## 🔐 セキュリティ

- ✅ パスワード: SHA-256 ハッシュ化（ローカル保存）
- ✅ QR共有: 安全な情報エンコード
- ✅ 個人メモ: ローカル保存のみ

## 📚 参照資料

- [React Native ドキュメント](https://reactnative.dev)
- [Expo ドキュメント](https://docs.expo.dev)
- [AWS Amplify](https://docs.amplify.aws)

## 📝 ライセンス

MIT License - 詳細は [LICENSE](./LICENSE) を参照

---

**最終更新**: 2026年4月1日
