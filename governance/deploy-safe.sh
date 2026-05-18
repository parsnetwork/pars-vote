#!/bin/bash
# Deploy PARS DAO Safe Multisig on Pars Network EVM
#
# 3-of-5 threshold multisig with addresses derived from:
# mnemonic: light light light light light light light light light light light energy
#
# Network: Pars Network EVM (Lux L2, upgradeable to L1)

set -e

echo "=== PARS DAO Safe Deployment ==="
echo "Network: Pars Network EVM (Lux L2)"
echo "Chain ID: 494949"
echo ""

# Signer addresses derived from mnemonic
SIGNERS=(
  "0x35D64Ff3f618f7a17DF34DCb21be375A4686a8de"  # Index 0
  "0xdAF82928dE0ABBAE133322020B253283d335d3A8"  # Index 1
  "0xBb5D7C55DbbB353f9e7667dbCC43B228B857998a"  # Index 2
  "0x6828eAa708F40c11C121C25BdbB4a6fd1415fB24"  # Index 3
  "0xa238C9E15C4AD9b10441fe9f7afFa6A131F4Cc37"  # Index 4
)

THRESHOLD=3

echo "Threshold: $THRESHOLD of ${#SIGNERS[@]}"
echo ""
echo "Signers:"
for i in "${!SIGNERS[@]}"; do
  echo "  $i: ${SIGNERS[$i]}"
done
echo ""

# Check if cast is available
if command -v cast &> /dev/null; then
  echo "Using Foundry cast for deployment..."

  # Verify addresses
  echo "Verifying signer addresses..."
  cast wallet address --mnemonic "light light light light light light light light light light light energy" --mnemonic-derivation-path "m/44'/60'/0'/0/0"

  echo ""
  echo "=== Ready for Deployment ==="
  echo "To deploy, use:"
  echo "  forge create MockSafe --constructor-args \"[${SIGNERS[*]}]\" $THRESHOLD --rpc-url \$PARS_RPC_URL --private-key \$DEPLOYER_PRIVATE_KEY"
else
  echo "Foundry not found. Install with: curl -L https://foundry.paradigm.xyz | bash"
fi

echo ""
echo "Config file: governance/safe-config.json"
cat safe-config.json | head -30
