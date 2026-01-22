#!/bin/bash

# Test if you have Admin API access
# This script will test various Admin API endpoints

echo "========================================="
echo "Testing SolusVM v1 Admin API Access"
echo "========================================="
echo ""

API_URL="https://nerdvm.racknerd.com/api/admin/command.php"
KEY="IYAGA-A3PC5-HIGU6"
HASH="044b4f3b6ac357d48cd62e5a8d891d4cc0cbe17f"

echo "Testing endpoint: $API_URL"
echo ""

# Test 1: List Virtual Servers
echo "Test 1: Trying to list all virtual servers..."
echo "Command: vserver-list"
echo ""
curl -s "${API_URL}?key=${KEY}&hash=${HASH}&action=vserver-list" | head -20
echo ""
echo "========================================="
echo ""

# Test 2: List Nodes
echo "Test 2: Trying to list nodes..."
echo "Command: node-idlist"
echo ""
curl -s "${API_URL}?key=${KEY}&hash=${HASH}&action=node-idlist" | head -20
echo ""
echo "========================================="
echo ""

# Test 3: List Plans
echo "Test 3: Trying to list plans..."
echo "Command: plans-list"
echo ""
curl -s "${API_URL}?key=${KEY}&hash=${HASH}&action=plans-list" | head -20
echo ""
echo "========================================="
echo ""

echo "Analysis:"
echo ""
echo "If you see XML with server data above:"
echo "  ✅ YOU HAVE ADMIN API ACCESS! (just use /admin/ instead of /client/)"
echo ""
echo "If you see 'Invalid API Credentials' or 'Access Denied':"
echo "  ❌ You need to request Admin API access from RackNerd"
echo ""
echo "If you see 'Connection failed':"
echo "  ⚠️  The admin endpoint might not exist or network issue"
echo ""
echo "========================================="
