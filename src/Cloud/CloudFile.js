// Moralis cloud functions:
// * add address to watch list
// * alert on change of address state

// todo: implement various conditions to apply to wathced addresses
// todo: cross-chain compatible.
// todo: all hardcoded variables and settings are exposed to frontend UI
// todo: user accounts login/logout/etc

// ---

const sendTelegramAlert = async (tx_data, token_data) => {
  // Telegram creds
  const telegram_bot_id = 'xxx' // <-- ENTER TELEGRAM BOT ID
  const chat_id = '-xxx' // <-- ENTER TELEGRAM CHAT ID

  // alert message
  let message = 'https://etherscan.io/tx/' + request.get('hash')

  // Moralis httpRequest to Telegram API
  Moralis.Cloud.httpRequest({
    url: 'https://api.telegram.org/bot' + telegram_bot_id + '/sendMessage',
    method: 'POST',
    crossDomain: true,
    headers: {
      'Content-Type': 'application/json',
      'cache-control': 'no-cache',
    },
    params: 'chat_id=' + chat_id + '&text=' + message,
  }).then(
    function (httpResponse) {
      logger.info(httpResponse.text)
    },
    function (httpResponse) {
      logger.info('Request failed with response code ' + httpResponse.status)
    },
  )
}

// this will be done through sendgrid and moralis integration
// full description of how to set this up with Moralis x SendGrid here:
// https://youtu.be/SY30AUb8144
// docs here: https://docs.moralis.io/moralis-server/tools/sending-email
const sendEmailAlert = async (request) => {
  let _link = 'https://etherscan.io/tx/' + request.get('hash')

  Moralis.Cloud.sendEmail({
    to: 'xxx', // <-- ENTER EMAIL ADDRESS HERE
    templateId: 'd-xxx', // <-- ENTER SENDGRID TEMPLATE ID HERE
    dynamic_template_data: {
      link: _link,
    },
  })
}

Moralis.Cloud.define('watchAddress', async (request) => {
  const logger = Moralis.Cloud.getLogger()

  // check 1/2: address exists
  if (!request.params.address) {
    logger.info('error: missing address param.')
  } else {
    let address = request.params.address
    let alert_method = request.params.alert_method
    let conditions = request.params.conditions
    let email = request.params.email
    let treshold = request.params.treshold
    let notes = request.params.notes

    if (!address || !alert_method) {
      return null
    }

    // NEV added this
    // if (alert_method === 'email') {
    //   sendEmailAlert(email)
    // }

    // check 2/2: address is not already being watched
    const countQuery = new Moralis.Query('WatchedAddress')
    countQuery.equalTo('address', address)
    const watchCount = await countQuery.count()

    if (watchCount > 0) {
      // already being watched, don't add again
      return null
    }

    // add address to watch list
    // sync all transactions in realtime to WatchedAddress class
    await Moralis.Cloud.run('watchEthAddress', {
      address, // <-- address to watch
      sync_historical: false, // <-- do not sync historical data
    })

    // save to DB
    const query = new Moralis.Query('WatchedAddress')
    query.equalTo('address', address)
    const result = await query.first()
    result.set('address', address)
    result.set('alertMethod', alert_method)
    result.set('conditions', conditions)
    result.set('email', email)
    result.set('treshold', treshold)
    result.set('notes', notes)

    try {
      await result.save()
    } catch (error) {
      logger.info(error)
    }

    Moralis.Cloud.afterSave('EthTokenTransfers', async function (request) {
      let token_address = request.object.get('token_address')
      let token_data = null

      let tokenQuery = new Moralis.Query('EthTokenBalance')
      tokenQuery.equalTo('token_address', token_address)
      token_data = await tokenQuery.first()

      function decimalBalanceFormat(_value, _decimals) {
        let __value = parseFloat(_value) / Math.pow(10, _decimals)
        return __value
          .toString()
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
      }

      // value transferred to use in:
      // - threshold paramaters
      // - human readable message sent
      let decimals = Number(token_data.get('decimals'))
      let value = request.object.get('value')

      // temp demo readouts
      logger.info('-------------------------------')
      logger.info(JSON.stringify(token_data))
      logger.info('------ Token Data ------')

      logger.info('-------------------------------')
      logger.info(JSON.stringify(request.object))
      logger.info('------ Transfer Data ------')

      logger.info('-------------------------------')
      logger.info(JSON.stringify(decimalBalanceFormat(value, decimals)))
      logger.info('------ Value Rendered ------')

      // todo: insert handling including increase/decrease here
      // next: trigger allocated alert method
      // e.g. sendTelegramAlert(request.object, token_data);
    })

    return true
  }
})
