const { network } = require("hardhat");
const {
    developmentChains,
    DECIMALS,
    INITAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = await network.config.chainId;

    if (developmentChains.includes(network.name)) {
        log("Local Network detected, deploying mocks...");
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITAL_ANSWER],
        });
        log("Mocks Deployed!");
        log("----------------------------------------------------");
    }
};

module.exports.tags = ["all", "mocks"];
