# AOAI Teams ChatBot デモアプリ

AOAI (Azure OpenAI Service) の ChatGPT を使った Teams 向け Bot Service アプリです。


## システム構成

本デモ環境は以下のような環境を想定。

![](./docs/images/architecture.png)

- すべてPublicに配置されたリソース。
- Bot Service
    - Teams チャンネルを作成
- App Service
    - Linux
    - Node.js v16
- OpenAI Service
    - ChatGPT 3.5 turbo
    - `chat completions` API 利用


## フォルダ構成

フォルダは以下の通り。

```
├───aoai-chatbot                                // BotServiceアプリ本体（=AppServiceで動作するアプリ）
│   ├───deploymentTemplates
│   └───resouces
│
├───teams-app-pkg                               // Teamsアプリ展開用のひな形
│       bot-icon-large.png
│       bot-icon-small.png
│       manifest.json.sample
│
└───docs
```


## 環境変数

AppService（ `aoai-chatbot` ）が必要な環境変数は以下の通り。

| name | value |
|---|---|
| `MicrosoftAppType` | `UserAssignedMSI` 固定 |
| `MicrosoftAppId` | ユーザー割り当てマネージド ID のクライアント ID。 |
| `MicrosoftAppPassword` | （空欄） |
| `MicrosoftAppTenantId` | ユーザー割り当てマネージド ID のテナント ID。 |
| `ENDPOINT` | OpenAI Service の エンドポイント |
| `DEPLOYMENT_NAME` | OpenAI Service の利用したい モデルデプロイ名 |
| `API_KEY` | OpenAI Service のアクセスキー |

**ローカル実行する場合** 

`/aoai-chatbot/.env` ファイルを作成。
BotService用の以下の環境変数は不要なので空欄のままにする。

* MicrosoftAppType
* MicrosoftAppId
* MicrosoftAppPassword
* MicrosoftAppTenantId

**AppServiceへ登録する場合**

`MicrosoftAppPassword` 以外は適切な値を設定する。


## 展開手順（概要）

1. Azure上に必要なリソースを作成

    * マネージドID（Botサービス作成時に自動生成選択）
    * BotService
    * AppService (Node.js v16, Linux)
    * OpenAI Service

1. AppServiceへアプリを展開

    `/aoai-chatbot` をリリース

    VSCode の AppService プラグイン 使ってリリースが簡単

1. 必要な設定を実施

    1. BotService

        * [設定]-[構成] 
        
            「メッセージングエンドポイント」に AppServiceのURLを設定

            設定する際はエンドポイントが `/api/messages` になるようにする

            ```
            https://{YOUR_APPSERVICE_NAME}.azurewebsites.net/api/messages
            ```

    1. AppService

        * [設定]-[ID]
        
            ユーザー定義マネージドID（Botサービス作成時に自動生成されるもの）を設定

        * [設定]-[構成]

            「環境変数」の説明にある環境変数をすべて設定。
        
        * 設定終われば「再起動」

1. （任意） Bot Service にある [設定]-[Webチャットでテスト] で動作確認

1. Bot Service にチャンネルを追加

    1. [設定]-[チャンネル] を開いて Teamsチャンネル を追加


