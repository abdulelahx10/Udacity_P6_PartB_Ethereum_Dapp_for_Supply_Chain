App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originCarFactoryID: "0x0000000000000000000000000000000000000000",
    originCarFactoryName: null,
    originCarFactoryInformation: null,
    originCarFactoryLatitude: null,
    originCarFactoryLongitude: null,
    carNotes: null,
    carPrice: 0,
    dealerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.upc = $("#upc").val();
        App.upc2 = $("#upc2").val();
        App.upc3 = $("#upc3").val();
        App.upc4 = $("#upc4").val();
        App.upc5 = $("#upc5").val();
        App.upc6 = $("#upc6").val();
        App.ownerID = $("#ownerID").val();
        App.originCarFactoryID = $("#originCarFactoryID").val();
        App.originCarFactoryName = $("#originCarFactoryName").val();
        App.originCarFactoryInformation = $("#originCarFactoryInformation").val();
        App.originCarFactoryLatitude = $("#originCarFactoryLatitude").val();
        App.originCarFactoryLongitude = $("#originCarFactoryLongitude").val();
        App.carNotes = $("#carNotes").val();
        App.carPrice = $("#carPrice").val();
        App.carPrice2 = $("#carPrice2").val();
        App.dealerID = $("#dealerID").val();
        App.consumerID = $("#consumerID").val();
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
            
            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        App.readForm()
        switch(processId) {
            case 1:
                return await App.buildCarPart(event);
                break;
            case 2:
                return await App.buildCar(event);
                break;
            case 3:
                return await App.sellCar(event);
                break;
            case 4:
                return await App.buyCar(event);
                break;
            case 5:
                return await App.shipCar(event);
                break;
            case 6:
                return await App.receiveCar(event);
                break;
            case 7:
                return await App.purchaseCar(event);
                break;
            case 8:
                return await App.fetchCarBufferOne(event);
                break;
            case 9:
                return await App.fetchCarBufferTwo(event);
                break;
            case 10:
                return await App.addCarFactory(event)
                break;
            case 11:
                return await App.addDealer(event)
                break;
            case 12:
                return await App.addConsumer(event)
                break;
            }
    },

    addCarFactory: function (event) {
        event.preventDefault()
        var processId = parseInt($(event.target).data('id'))
        const userAddress = $('#userAddress').val()
        App.contracts.SupplyChain.deployed()
          .then(function (instance) {
            return instance.addCarFactory(userAddress, { from: App.metamaskAccountID })
          })
          .then(function (result) {
            $('#ftc-users').text(`CarFactory role added to ${userAddress}`)
          })
          .catch(function (err) {
            $('#ftc-users').text(`This user already have this role`)
            console.log(err.message)
          })
      },

      addDealer: function (event) {
        event.preventDefault()
        var processId = parseInt($(event.target).data('id'))
        const userAddress = $('#userAddress').val()
        App.contracts.SupplyChain.deployed()
          .then(function (instance) {
            return instance.addDealer(userAddress, { from: App.metamaskAccountID })
          })
          .then(function (result) {
            $('#ftc-users').text(`Dealer role added to ${userAddress}`)
          })
          .catch(function (err) {
            $('#ftc-users').text(`This user already have this role`)
            console.log(err.message)
          })
      },

      addConsumer: function (event) {
        event.preventDefault()
        var processId = parseInt($(event.target).data('id'))
        const userAddress = $('#userAddress').val()
        App.contracts.SupplyChain.deployed()
          .then(function (instance) {
            return instance.addConsumer(userAddress, { from: App.metamaskAccountID })
          })
          .then(function (result) {
            $('#ftc-users').text(`Consumer role added to ${userAddress}`)
          })
          .catch(function (err) {
            $('#ftc-users').text(`This user already have this role`)
            console.log(err.message)
          })
      },
    buildCarPart: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.buildCarPart(
                App.upc2, 
                App.metamaskAccountID, 
                App.originCarFactoryName, 
                App.originCarFactoryInformation, 
                App.originCarFactoryLatitude, 
                App.originCarFactoryLongitude, 
                App.carNotes
            );
        }).then(function(result) {
            $("#ftc-carfactory-op").text('buildCarPart');
            console.log('buildCarPart',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    buildCar: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.buildCar(App.upc3, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-carfactory-op").text('buildCar');
            console.log('buildCar',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    sellCar: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const carPrice = web3.toWei(App.carPrice, "ether");
            console.log('carPrice',carPrice);
            return instance.sellCar(App.upc4, carPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-carfactory-op").text('sellCar');
            console.log('sellCar',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    buyCar: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const walletValue = web3.toWei(App.carPrice2, "ether");
            return instance.buyCar(App.upc5, {from: App.metamaskAccountID, value: walletValue});
        }).then(function(result) {
            $("#ftc-dealer-op").text('buyCar');
            console.log('buyCar',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    shipCar: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipCar(App.upc6, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-dealer-op").text('shipCar');
            console.log('shipCar',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    receiveCar: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveCar(App.upc6, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-dealer-op").text('receiveCar');
            console.log('receiveCar',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    purchaseCar: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.purchaseCar(App.upc6, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-dealer-op").text('purchaseCar');
            console.log('purchaseCar',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchCarBufferOne: function () {
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchCarBufferOne.call(App.upc);
        }).then(function(result) {
          $("#ftc-car-details").text(result);
          console.log('fetchCarBufferOne', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchCarBufferTwo: function () {
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchCarBufferTwo.call(App.upc);
        }).then(function(result) {
          $("#ftc-car-details").text(result);
          console.log('fetchCarBufferTwo', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });
        
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
