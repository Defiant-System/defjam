<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="sidebar-list">
	<xsl:for-each select="./*">
		<xsl:sort order="ascending" select="@type"/>
		<xsl:choose>
			<xsl:when test="@type = 'folder'">
				<div class="folder">
					<xsl:attribute name="data-id">
						<xsl:value-of select="@id"/>
					</xsl:attribute>
					<i class="icon-arrow_up"></i>
					<span><xsl:value-of select="@name"/></span>
					<div><div></div></div>
				</div>
			</xsl:when>
			<xsl:otherwise>
				<div class="item"><xsl:value-of select="@name"/></div>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:for-each>
</xsl:template>

<xsl:template name="session">
	<div class="session">
		<div class="tracks-wrapper">
			<div class="tracks">
				<xsl:call-template name="track">
					<xsl:with-param name="node" select="//Tracks" />
				</xsl:call-template>
				<div class="space"></div>
			</div>
		</div>

		<div class="io-master">
			<xsl:call-template name="track">
				<xsl:with-param name="node" select="//IoMaster" />
			</xsl:call-template>
		</div>
	</div>
</xsl:template>

<xsl:template name="track">
	<xsl:param name="node" select="."/>
	<xsl:for-each select="$node/*">
		<div class="track-wrapper">
			<div class="track">
				<div class="title"><xsl:value-of select="@name"/></div>
				<div class="slots">
					<div class="slot"></div>
					<div class="slot"></div>
					<div class="slot"></div>
					<div class="slot"></div>
					<div class="slot"></div>
					<div class="slot"></div>
					<div class="slot"></div>
					<div class="space"></div>
					<div class="status"></div>
				</div>
				<div class="io"></div>
				<div class="sends">
					<div class="knob" data-value="0" data-label="A"><div></div></div>
					<div class="knob" data-value="0" data-label="B"><div></div></div>
				</div>
				<div class="mixer">
					<div>
						<div class="pan-knob" data-value="0"><div></div></div>
						<xsl:if test="@name != 'Master'">
							<div class="toggle-button activator">
								<xsl:choose>
									<xsl:when test="@name = 'Reverb'">A</xsl:when>
									<xsl:when test="@name = 'Delay'">B</xsl:when>
									<xsl:otherwise><xsl:value-of select="position()"/></xsl:otherwise>
								</xsl:choose>
							</div>
							<div class="toggle-button solo">S</div>
							<div class="toggle-button record">&#9679;</div>
						</xsl:if>
					</div>
					<div class="volume" data-value="88"><div></div></div>
				</div>
			</div>
		</div>
	</xsl:for-each>
</xsl:template>

</xsl:stylesheet>
