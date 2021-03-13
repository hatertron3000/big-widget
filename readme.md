# BigWidget
A tool to help make [Page Builder widget templates](https://developer.bigcommerce.com/api-docs/store-management/widgets/overview#widget-templates) for BigCommerce stores.

## Prerequisites
- a BigCommerce store
- a BigCommerce store API account with the following scopes:

| UI Name | Permission | Parameter          |
|---------|------------|--------------------|
| Content | modify     | `store_v2_content` |

For more information on creating BigCommerce API accounts, see the [BigCommerce documentation](https://support.bigcommerce.com/s/article/Store-API-Accounts).

## Installation
`npm i -g @ppuente/big-widget`

## Usage
Create a project folder

`mkdir my-widget`

Navigate into the project folder

`cd my-widget`

Initialize your project

`big-widget init`

Complete the prompts using your BigCommerce store API account.

Push your widget to the store

`big-widget push`

## Project Structure
### config.big-widget.json
Configuration values for your widget including the widget template name, store API path, widget template uuid and current version uuid.

### schema.json
A [widget UI schema](https://developer.bigcommerce.com/stencil-docs/page-builder/widget-ui-schema)

### storefront-api-query.graphql
A [BigCommerce GraphQL Storefront API](https://developer.bigcommerce.com/api-docs/storefront/graphql/graphql-storefront-api-overview) query used to [create widgets with dynamic data](https://developer.bigcommerce.com/api-docs/store-management/widgets/tutorials/dynamic-widgets).

### template.html
HTML and Handlebars used to populate the `template` of the widget template.