# API coverage: backend vs frontend & admin

APIs that are **not** implemented on the Node backend (or differ in path/behavior). When frontend/admin use the backend URL, these will 404 or need to be added.

---

## Frontend – not connected / missing on backend

| API (frontend) | Path | Backend status |
|----------------|------|----------------|
| ProductSearchAPI | `/product/minify/list` | **Missing** – backend has `GET /product` only; no minified list endpoint. |

All other frontend APIs are implemented and connected.

---

## Admin – backend status (integrated)

### Auth
| Admin API | Path | Backend |
|-----------|------|---------|
| verifyToken | `POST /verify-token` | **Implemented** – alias for verify-otp. |

### Users & roles
| Admin API | Path | Backend |
|-----------|------|---------|
| role | `GET /role`, `GET /role/:id` | **Implemented** |
| user | `GET/POST/PUT/DELETE /user`, `GET /user/:id` | **Implemented** |
| UserImportAPI / UserExportAPI | `user/csv/import`, `user/csv/export` | **Stub** – returns success message. |

### Catalog
| Admin API | Path | Backend |
|-----------|------|---------|
| Category/Attribute/Tag/Product CSV | `*/csv/import`, `*/csv/export` | **Stub** |
| Approved | `PUT/POST /product/approve/:id` | **Implemented** |

### Tax, shipping, attachment, state
| Admin API | Path | Backend |
|-----------|------|---------|
| tax | `GET/POST/PUT/DELETE /tax`, `GET /tax/:id` | **Implemented** |
| state | `GET /state` (optional `?country_id=`) | **Implemented** |
| shipping | `GET/POST/PUT/DELETE /shipping`, `GET /shipping/:id` | **Implemented** (requires `shipping_zones` table). |
| shippingRule | `GET/POST/PUT/DELETE /shippingRule`, `GET /shippingRule/:id` | **Implemented** |
| attachment | `GET /attachment`, `POST /attachment`, `POST /attachment/deleteAll` | **Implemented** (uses `media` table). |

### Wallet & points
| Admin API | Path | Backend |
|-----------|------|---------|
| WalletCredit / WalletDebit | `POST /credit/wallet`, `POST /debit/wallet` | **Implemented** |
| VendorTransactions | `GET /wallet/vendor` | **Implemented** |
| VendorWalletCredit/Debit | `POST /credit/vendorWallet`, `POST /debit/vendorWallet` | **Implemented** |
| PointCredit / PointDebit | `POST /credit/points`, `POST /debit/points` | **Implemented** |

### Dashboard & statistics
| Admin API | Path | Backend |
|-----------|------|---------|
| StatisticsCountAPI | `GET /statistics/count` | **Implemented** |
| DashboardChartAPI | `GET /dashboard/chart` | **Implemented** |

### Other admin-only
| Admin API | Path | Backend |
|-----------|------|---------|
| Notice | `GET/POST/PUT/DELETE /notice`, `GET /notice/recent` | **Implemented** (requires `notices`, `notice_reads` tables). |
| markAsReadNotice | `POST/PUT /notice/markAsRead` | **Implemented** |
| BadgeApi | `GET/POST/PUT/DELETE /badge` | **Implemented** (requires `badges` table). |
| WithdrawRequestAPI | `GET/POST/PUT /withdrawRequest` | **Implemented** (requires `withdraw_requests` table). |
| LicenseAPI | `GET/POST/PUT/DELETE /license-key` | **Implemented** (requires `license_keys` table). |
| VendorSettingAPI | `PUT/POST /updateStoreProfile` | **Implemented** |
| AppSettingsApi | `GET/POST/PUT /app/settings` | **Implemented** |
| sortMenu | `POST /menu/sort` | **Implemented** |
| commissionHistory | `GET /commissionHistory` | **Implemented** (requires `commission_history` table). |

---

## Schema for admin features

Run after main schema to create admin-only tables:

```bash
mysql -u root -p multikart < scripts/schema-admin.sql
```

This creates: `shipping_zones`, `shipping_rules`, `notices`, `notice_reads`, `badges`, `withdraw_requests`, `license_keys`, `commission_history`.

---

## Summary

- **Frontend:** Only `/product/minify/list` is missing on the backend.
- **Admin:** All listed admin APIs are implemented. CSV import/export are stubs. Ensure `schema-admin.sql` has been run for shipping, notices, badges, withdraw, license, and commission features.
